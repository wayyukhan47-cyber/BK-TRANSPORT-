import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Expected Payload from Zapier/WATI:
    // { "owner_phone": "+91...", "owner_name": "...", "vehicle_no": "...", "driver_phone": "...", "pickup_location": "...", "drop_location": "...", "offered_amount": 100000 }
    
    const shipment = await prisma.shipment.create({
      data: {
        ownerName: data.owner_name,
        ownerPhone: data.owner_phone,
        vehicleNo: data.vehicle_no,
        driverPhone: data.driver_phone,
        pickupLocation: data.pickup_location,
        dropLocation: data.drop_location,
        offeredAmount: Number(data.offered_amount),
        shipperQuote: 0, // Admin can update this later
        status: 'ACCEPTED' // Automatically set to ACCEPTED as per requirements
      }
    });

    return NextResponse.json({ success: true, shipment }, { status: 201 });
  } catch (error) {
    console.error("WhatsApp Webhook Error:", error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}
