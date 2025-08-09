import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import connectMongo from "~/lib/connect-mongo";
import User from "~/lib/models/user";

export async function GET(req: NextRequest) {
    try { 
        await connectMongo();
        const { searchParams } = new URL(req.url);
        const adminId = searchParams.get("adminId");
        
        if (!isValidObjectId(adminId)) {
            return NextResponse.json({
                error: 'Invalid or missing admin ID',
            
            },{status:400})
        }

        const user = await User.findById(adminId);
        if (!user) {
            return NextResponse.json(
                { error: 'No account was found with this Id' },
                {status:404 }
            )
        }
        
        const isAdmin = user.role === 'admin';
        if (!isAdmin) {
            return NextResponse.json(
                { error: 'Only admins are allowed to perform this action' },
                {status:403}
            )
        }

        const members = await User.find({});
        return NextResponse.json(
            { members },
            {status: 200}
        )
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({
            error: 'Could not fetch members data',
            
        },{status:500})
    }
}