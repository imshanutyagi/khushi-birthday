import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Attempting MongoDB connection...');
    await dbConnect();
    console.log('MongoDB connected successfully!');

    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful!'
    });
  } catch (error: any) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
