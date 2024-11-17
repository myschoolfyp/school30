import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import Admin from '@/models/Admin';
import Teacher from '@/models/Teacher';

export async function POST(req: Request) {
  await dbConnect(); // Connect to MongoDB

  try {
    // Parse the request body
    const {
      firstName, lastName, email, password, userType,
      contactNumber, classInfo, section, rollNumber,
      employeeCode, childId, adminCode,
    } = await req.json();

    // Define the mapping of user types to models
    const userModels: { [key: string]: any } = {
      Admin,
      Teacher,
      // You can add other models like Student, Parent here if needed
    };
    const UserModel = userModels[userType];

    // Check if the user type is valid
    if (!UserModel) {
      return NextResponse.json({ success: false, message: 'Invalid user type' }, { status: 400 });
    }

    // Check if the email already exists in the database
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const user = new UserModel({
      firstName, lastName, email, password: hashedPassword, contactNumber,
      adminCode, employeeCode, classInfo, section, rollNumber, childId
    });

    // Save the user to the database
    await user.save();

    // Respond with a success message and redirect URL
    return NextResponse.json({ success: true, message: 'User registered successfully' });

  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ success: false, message: 'Error registering user' }, { status: 500 });
  }
}