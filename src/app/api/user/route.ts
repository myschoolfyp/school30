// api/user.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Mock user data for the logged-in user, typically fetched from the session or JWT token
    const user = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      contactNumber: "+1234567890",
      userType: "Admin", // This should dynamically change based on the login (Admin or Teacher)
    };

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Error fetching user data" }, { status: 500 });
  }
}