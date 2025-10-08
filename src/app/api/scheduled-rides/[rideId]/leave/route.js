import { connectToDb } from "@/lib/mongodb";
import ScheduledRide from "@/models/ScheduledRide";
import { NextResponse } from "next/server";
import {verifyToken} from "@/lib/auth";
import mongoose from "mongoose";



export async function DELETE(request, { params }) {

    try {

        const { rideId } = await params;

        await connectToDb();

        if (!mongoose.Types.ObjectId.isValid(rideId)) {
            return NextResponse.json({error: "invalid rideId provided"}, {status: 400});
        }

        // get auth user
        const token = request.cookies.get('token')?.value;
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({error: "unauthorized"}, {status: 401});
        }

        // find corresponding ride
        const ride = await ScheduledRide.findById(rideId);

        // check ride exists
        if (!ride || ride.isCancelled) {
            return NextResponse.json({message: "Scheduled ride not found"}, {status: 404})
        }

        // check auth user is already participating, if so cannot join again
        if (!ride.participants.map(id => id.toString()).includes(decoded.id.toString())) {
            return NextResponse.json({error: "User is not a participant in this ride"}, {status: 400});
        }

        // remove user from participants -
        const filtered = ride.participants.filter(id => id.toString() !== decoded.id.toString());
        ride.participants = filtered;

        await ride.save();

        return NextResponse.json({message: 'Successfully left the ride.'}, {status: 200});

    } catch (error) {
        console.error('error leaving the scheduled ride:', error);
        return NextResponse.json({error: 'server error'}, {status: 500});
    }
}