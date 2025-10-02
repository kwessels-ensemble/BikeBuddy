import { connectToDb } from "@/lib/mongodb";
import User from "@/models/User";
import Ride from "@/models/Ride";
import { NextResponse } from "next/server";
import {verifyToken} from "@/lib/auth";


export async function GET(request) {

    try {

        await connectToDb();

        // get auth user
        const token = request.cookies.get('token')?.value;
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({error: "unauthorized"}, {status: 401});
        }

        const rides = await Ride.find({userId: decoded.id});
        return NextResponse.json({rides}, {status: 200});

    } catch (error) {
        console.error('rides error:', error);
        return NextResponse.json({error: 'server error'}, {status: 500});
    }
}