import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const mongoUri = "mongodb://localhost:27017/myschool";

export async function GET() {
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db();
    const teachers = await db.collection("teachers").find().toArray();
    return NextResponse.json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return NextResponse.json({ message: "Failed to fetch teachers data" }, { status: 500 });
  } finally {
    await client.close();
  }
}