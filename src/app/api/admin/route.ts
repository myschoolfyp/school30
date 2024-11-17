import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const mongoUri = "mongodb://localhost:27017/myschool";

export async function GET() {
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db();
    const admins = await db.collection("admins").find().toArray();
    return NextResponse.json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json({ message: "Failed to fetch admins data" }, { status: 500 });
  } finally {
    await client.close();
  }
}