import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const mongoUri = "mongodb://localhost:27017/myschool";

export async function GET() {
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db();
  const students = await db.collection("students").find().toArray();
  return NextResponse.json(students);
}