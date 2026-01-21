import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.MONGODB_URI;

export async function GET() {
  if (!uri) {
    return NextResponse.json(
      { error: "MONGODB_URI is not set" },
      { status: 500 }
    );
  }

  const client = new MongoClient(uri);
  attachDatabasePool(client);

  try {
    await client.connect();
    const db = client.db();

    const result = await db.collection("invoices").aggregate([
      { $match: { amount: 666 } },
      {
        $lookup: {
          from: "customers",
          localField: "customer_id",
          foreignField: "id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      {
        $project: {
          _id: 0,
          amount: 1,
          name: "$customer.name",
        },
      },
    ]).toArray();

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
