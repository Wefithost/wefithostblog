import { NextRequest, NextResponse } from "next/server";
import User from "~/lib/models/user";
import connectMongo from "~/lib/connect-mongo";
import { isValidObjectId } from "mongoose";
export async function PATCH(req: NextRequest) {
  try {
    await connectMongo();

    const { firstName, lastName, userId } = await req.json();
    
    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        { error: 'User Id not provided or invalid' },
        {status: 405},
      )
    }
    if (firstName.trim() === '') {
      return NextResponse.json(
        { error: 'First name is required' },
        {status: 405},
      )
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User  not authenticated" },
        { status: 404 }
      );
    }

    user.first_name = firstName;
user.last_name = lastName
    await user.save();

    return NextResponse.json(
      { message: "Name updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'An error occurred, please try again' }, { status: 500 });
  }
}
