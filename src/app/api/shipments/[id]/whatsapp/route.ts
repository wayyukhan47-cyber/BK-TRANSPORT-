import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Fetch the shipment
    const shipment = await prisma.shipment.findUnique({
      where: { id }
    });

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
    const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;

    if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_ID) {
      console.warn("WhatsApp credentials missing in .env");
    }

    let phoneNumber = shipment.ownerPhone.replace(/\D/g, ''); // Extract just digits
    if (phoneNumber.length === 10) {
      phoneNumber = `91${phoneNumber}`;
    }

    let success = false;

    const payload = {
      messaging_product: "whatsapp",
      to: phoneNumber,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: `Heyy! Are you ready for this offer ₹${shipment.offeredAmount} from ${shipment.pickupLocation} to ${shipment.dropLocation}?`
        },
        action: {
          buttons: [
            { type: "reply", reply: { id: "yes", title: "Yes" } },
            { type: "reply", reply: { id: "no", title: "No" } }
          ]
        }
      }
    };

    if (WHATSAPP_ACCESS_TOKEN && WHATSAPP_PHONE_ID) {
      const waResponse = await fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!waResponse.ok) {
        const errorData = await waResponse.text();
        console.error("Failed to send WhatsApp message:", errorData);
        return NextResponse.json({ error: 'Failed to send WhatsApp message' }, { status: 500 });
      }
      success = true;
    } else {
      console.log("Mocking WhatsApp send since credentials are missing. Message:", payload.interactive.body.text);
      success = true;
    }

    if (success) {
      // Update shipment bot state
      const updatedShipment = await prisma.shipment.update({
        where: { id },
        data: { botState: 'PENDING_CONFIRMATION' }
      });

      return NextResponse.json(updatedShipment, { status: 200 });
    }

  } catch (error) {
    console.error("WhatsApp trigger error:", error);
    return NextResponse.json({ error: 'Internal server error', details: (error as Error)?.message || String(error) }, { status: 500 });
  }
}
