import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("finance_visualizer");
    const transactions = await db.collection("transactions").find({}).sort({ date: -1 }).toArray();
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { amount, date, description, category } = await request.json();
    if (!amount || !date || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db("finance_visualizer");
    const transaction = {
      amount: parseFloat(amount),
      date: new Date(date),
      description,
      category,
      createdAt: new Date()
    };
    const result = await db.collection("transactions").insertOne(transaction);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add transaction' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, amount, date, description, category } = await request.json();
    if (!id || !amount || !date || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db("finance_visualizer");
    const result = await db.collection("transactions").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          amount: parseFloat(amount),
          date: new Date(date),
          description,
          category,
          updatedAt: new Date()
        }
      }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Missing transaction ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("finance_visualizer");
    const result = await db.collection("transactions").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
} 