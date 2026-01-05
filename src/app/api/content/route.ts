import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PageContent from '@/lib/models/PageContent';

// GET - Fetch page content
export async function GET() {
  try {
    await dbConnect();

    let content = await PageContent.findOne();

    // If no content exists, create default
    if (!content) {
      content = await PageContent.create({});
    }

    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update page content
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // Use findOneAndUpdate to avoid version conflicts
    const content = await PageContent.findOneAndUpdate(
      {}, // Find the first document
      body, // Update with new data
      {
        new: true, // Return the updated document
        upsert: true, // Create if doesn't exist
        runValidators: true // Run schema validators
      }
    );

    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
