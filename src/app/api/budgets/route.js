import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';

// Helper to get YYYY-MM for current month
function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('finance_visualizer');
    const month = getCurrentMonth();
    const doc = await db.collection('budgets').findOne({ month });
    return NextResponse.json(doc?.budgets || {});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const budgets = await request.json();
    const client = await clientPromise;
    const db = client.db('finance_visualizer');
    const month = getCurrentMonth();
    await db.collection('budgets').updateOne(
      { month },
      { $set: { budgets } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save budgets' }, { status: 500 });
  }
} 