import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const shipments = await prisma.shipment.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(shipments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shipments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const shipment = await prisma.shipment.create({
      data: {
        ownerName: data.ownerName,
        ownerPhone: data.ownerPhone,
        vehicleNo: data.vehicleNo,
        driverPhone: data.driverPhone,
        pickupLocation: data.pickupLocation,
        dropLocation: data.dropLocation,
        offeredAmount: Number(data.offeredAmount),
        shipperQuote: Number(data.shipperQuote || 0),
        status: data.status || 'OFFER_SENT'
      }
    });
    return NextResponse.json(shipment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create shipment' }, { status: 500 });
  }
}
