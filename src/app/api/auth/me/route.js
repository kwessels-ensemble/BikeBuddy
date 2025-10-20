import { verifyToken } from "@/lib/auth";
import { connectToDb } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {

    await connectToDb();

    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);

    if (!decoded) {
        return NextResponse.json({user: null}, {status: 401})
    }

    const user = await User.findById(decoded.id).select("-password");
    return NextResponse.json({user}, {status: 200});

}