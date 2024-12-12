import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from "convex/browser";
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    // Get query parameters from the URL
    const { searchParams } = new URL(req.url);
    const machineId = searchParams.get("machineId");
    const temperature = searchParams.get("temperature");
    const rating = searchParams.get("rating");
    const canisterLevel = searchParams.get("canisterLevel");

    // Validate the required parameters
    if (!machineId || !temperature || !rating || !canisterLevel) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Call the Convex mutation
    const result = await convex.mutation(api.iot.addIoTData, {
      machineId,
      temperature: parseFloat(temperature), // Convert to number if needed
      rating: parseFloat(rating), // Convert to number if needed
      canisterLevel: parseFloat(canisterLevel), // Convert to number if needed
    });

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error('Failed to add IoT data:', error);
    return NextResponse.json({ success: false, error: 'Failed to add IoT data' }, { status: 500 });
  }
}
