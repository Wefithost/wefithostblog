import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectMongo from "~/lib/connect-mongo";
import User from "~/lib/models/user";

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const { email, verificationCode } = await req.json();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(
      verificationCode.toString(),
      user.verification_hash as string
    );

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    user.verification_hash = undefined;

    return NextResponse.json({ email: email }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Verification failed" + error },
      { status: 500 }
    );
  }
}
