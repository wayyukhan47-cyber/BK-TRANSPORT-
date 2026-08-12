import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Parse params from the webhook verification request
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verifyToken) {
      console.log("WEBHOOK_VERIFIED");
      return new NextResponse(challenge, { status: 200 });
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  return new NextResponse("Bad Request", { status: 400 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if it's a WhatsApp status update or message
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;

      // If there are messages in the payload
      if (messages && messages.length > 0) {
        const message = messages[0];
        const contact = value.contacts?.[0];

        // Extract relevant data
        const messageId = message.id;
        const senderPhone = contact?.wa_id || message.from;
        const timestamp = message.timestamp;
        
        // Extract text body
        let messageText = "";
        if (message.type === "text") {
          messageText = message.text.body;
        } else {
          messageText = `[Received non-text message type: ${message.type}]`;
        }

        // Save to database using Prisma
        await prisma.whatsAppMessage.create({
          data: {
            messageId,
            senderPhone,
            body: messageText,
            timestamp
          }
        });

        console.log(`Saved new message from ${senderPhone}`);

        // Handle bot state
        // Try to find an active shipment for this sender
        const activeShipment = await prisma.shipment.findFirst({
          where: {
            ownerPhone: {
              contains: senderPhone.substring(2) // simple fuzzy match if it has country code
            },
            botState: {
              not: null
            }
          }
        });

        if (activeShipment) {
          const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
          const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;

          const sendWaMessage = async (text: string) => {
            if (WHATSAPP_ACCESS_TOKEN && WHATSAPP_PHONE_ID) {
              await fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  messaging_product: "whatsapp",
                  to: senderPhone,
                  type: "text",
                  text: { body: text }
                })
              });
            } else {
              console.log("Mock reply:", text);
            }
          };

          const lowerText = messageText.toLowerCase();

          if (activeShipment.botState === 'PENDING_CONFIRMATION') {
            if (lowerText.includes('yes')) {
              await prisma.shipment.update({
                where: { id: activeShipment.id },
                data: { botState: 'WAITING_FOR_DRIVER_NO' }
              });
              await sendWaMessage("Please provide the driver number.");
            } else if (lowerText.includes('no')) {
              await prisma.shipment.update({
                where: { id: activeShipment.id },
                data: { botState: null, status: 'CANCELLED' }
              });
              await sendWaMessage("Shipment cancelled.");
            } else {
              await sendWaMessage("Please reply with 'Yes' or 'No'.");
            }
          } else if (activeShipment.botState === 'WAITING_FOR_DRIVER_NO') {
            await prisma.shipment.update({
              where: { id: activeShipment.id },
              data: {
                botState: null,
                status: 'ACCEPTED',
                driverPhone: messageText
              }
            });
            await sendWaMessage("Congratulations you have won this deal.");
          }
        }
      }
      
      // WhatsApp requires a 200 OK response to acknowledge receipt
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Not a WhatsApp Webhook' }, { status: 404 });
    }
  } catch (error) {
    console.error("WhatsApp Webhook POST Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
