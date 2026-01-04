import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Gift from '@/lib/models/Gift';

// GET - Fetch all gifts
export async function GET() {
  try {
    await dbConnect();

    const gifts = await Gift.find().sort({ order: 1 });

    console.log('GET /api/gifts - Fetched gifts:', gifts.map(g => ({
      id: g._id,
      title: g.title,
      showInSelection: g.showInSelection,
      showInLuckGame: g.showInLuckGame
    })));

    return NextResponse.json({ success: true, data: gifts });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new gift
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const gift = await Gift.create(body);

    return NextResponse.json({ success: true, data: gift }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update gift
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { id, ...updateData } = body;

    console.log('PUT /api/gifts - Update data:', { id, updateData });

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Gift ID is required' },
        { status: 400 }
      );
    }

    // Use updateOne with $set to force MongoDB to create the field
    await Gift.collection.updateOne(
      { _id: new (require('mongodb').ObjectId)(id) },
      { $set: updateData }
    );

    // Now fetch the updated document
    const gift = await Gift.findById(id);

    if (!gift) {
      return NextResponse.json(
        { success: false, error: 'Gift not found' },
        { status: 404 }
      );
    }

    console.log('PUT /api/gifts - Updated gift:', {
      id: gift._id,
      title: gift.title,
      showInSelection: gift.showInSelection,
      showInLuckGame: gift.showInLuckGame
    });

    return NextResponse.json({ success: true, data: gift });
  } catch (error: any) {
    console.error('PUT /api/gifts - Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete gift
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Gift ID is required' },
        { status: 400 }
      );
    }

    const gift = await Gift.findByIdAndDelete(id);

    if (!gift) {
      return NextResponse.json(
        { success: false, error: 'Gift not found' },
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
