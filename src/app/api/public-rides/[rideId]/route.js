import { connectToDb } from "@/lib/mongodb";
import ScheduledRide from "@/models/ScheduledRide";
import { NextResponse } from "next/server";
import {verifyToken} from "@/lib/auth";
import mongoose from "mongoose";



export async function GET(request, { params }) {

    try {

        const { rideId } = await params;

        await connectToDb();

        if (!mongoose.Types.ObjectId.isValid(rideId)) {
            return NextResponse.json({error: "Invalid rideId provided"}, {status: 400});
        }

        // get auth user
        const token = request.cookies.get('token')?.value;
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({error: "unauthorized"}, {status: 401});
        }

        const ride = await ScheduledRide.findOne({_id: rideId, isPublic: true, isCancelled: false})
            .populate('organizer', 'username')
            .populate('participants', 'username');

        // check if ride exists
        if (!ride) {
            return NextResponse.json({message: "Public ride not found"}, {status: 404})
        }

        return NextResponse.json(ride, {status: 200});

    } catch (error) {
        console.error('error fetching public ride:', error);
        return NextResponse.json({error: 'server error'}, {status: 500});
    }
}
