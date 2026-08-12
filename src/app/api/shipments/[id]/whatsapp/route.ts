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

    const messageText = `Heyy! ${shipment.ownerName} your vehicle no. ${shipment.vehicleNo} is ready for ship our product from ${shipment.pickupLocation} to ${shipment.dropLocation} at the rs ${shipment.offeredAmount}. Options: Yes or No`;
    
    const phoneNumber = shipment.ownerPhone.replace(/\D/g, ''); // Extract just digits

    let success = false;

    if (WHATSAPP_ACCESS_TOKEN && WHATSAPP_PHONE_ID) {
      const waResponse = await fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phoneNumber,
          type: "text",
          text: { body: messageText }
        })
      });

      if (!waResponse.ok) {
        const errorData = await waResponse.text();
        console.error("Failed to send WhatsApp message:", errorData);
        return NextResponse.json({ error: 'Failed to send WhatsApp message' }, { status: 500 });
      }
      success = true;
    } else {
      console.log("Mocking WhatsApp send since credentials are missing. Message:", messageText);
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

  } catch (error: any) {
    console.error("WhatsApp trigger error:", error);
    return NextResponse.json({ error: 'Internal server error', details: error?.message || String(error) }, { status: 500 });
  }
}
