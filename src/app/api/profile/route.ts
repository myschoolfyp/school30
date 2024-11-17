import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const mongoUri = "mongodb://localhost:27017/myschool";

export async function GET(request: Request) {
  try {
    const email = request.headers.get("email");
    const userType = request.headers.get("userType");

    if (!email || !userType) {
      return NextResponse.json(
        { message: "Missing email or userType" },
        { status: 400 }
      );
    }

    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db();
    let user;

    if (userType === "Admin") {
      user = await db.collection("admins").findOne({ email });
    } else if (userType === "Teacher") {
      user = await db.collection("teachers").findOne({ email });
    } else {
      return NextResponse.json(
        { message: "Invalid userType" },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { firstName, lastName, contactNumber } = user;
    return NextResponse.json({ firstName, lastName, email, contactNumber });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching profile:", error.message);
      return NextResponse.json(
        { message: "Internal server error", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error fetching profile:", error);
      return NextResponse.json(
        { message: "Internal server error", error: "Unknown error occurred" },
        { status: 500 }
      );
    }
  }
  
}
