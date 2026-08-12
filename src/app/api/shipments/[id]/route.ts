import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const data = await request.json();
    const resolvedParams = await params;
    
    const shipment = await prisma.shipment.update({
      where: { id: resolvedParams.id },
      data: {
        ownerName: data.ownerName,
        ownerPhone: data.ownerPhone,
        vehicleNo: data.vehicleNo,
        driverPhone: data.driverPhone,
        pickupLocation: data.pickupLocation,
        dropLocation: data.dropLocation,
        offeredAmount: Number(data.offeredAmount),
        shipperQuote: Number(data.shipperQuote || 0),
        status: data.status
      }
    });
    return NextResponse.json(shipment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update shipment' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await prisma.shipment.delete({
      where: { id: resolvedParams.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete shipment' }, { status: 500 });
  }
}
