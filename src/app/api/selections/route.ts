import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Selection from '@/lib/models/Selection';

// GET - Fetch all selections
export async function GET() {
  try {
    await dbConnect();

    const selections = await Selection.find().sort({ timestamp: -1 });

    return NextResponse.json({ success: true, data: selections });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new selection
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const selection = await Selection.create(body);

    return NextResponse.json({ success: true, data: selection }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete selection
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Selection ID is required' },
        { status: 400 }
      );
    }

    const selection = await Selection.findByIdAndDelete(id);

    if (!selection) {
      return NextResponse.json(
        { success: false, error: 'Selection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
