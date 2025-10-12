import { connectToDb } from "@/lib/mongodb";
import ScheduledRide from "@/models/ScheduledRide";
import { NextResponse } from "next/server";
import {verifyToken} from "@/lib/auth";
import mongoose from "mongoose";



export async function POST(request, { params }) {

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

        // check if auth user is the organizer, if so then cannot join/leave (default is they are a participant)
        if (decoded.id.toString() === ride.organizer._id.toString()) {
            return NextResponse.json({error: "User is ride organizer so already joined ride"}, {status: 400});
        }

        // check auth user is already participating, if so cannot join again
        if (ride.participants.map(id => id.toString()).includes(decoded.id.toString())) {
            return NextResponse.json({error: "User is already a participant in this ride"}, {status: 400});
        }

        // add participant -
        ride.participants.push(decoded.id);

        await ride.save();

        // populate ride w/ usernames
        await ride.populate('organizer', 'username')
        await ride.populate('participants', 'username');

        return NextResponse.json(ride, {status: 201});

    } catch (error) {
        console.error('error joining the scheduled ride:', error);
        return NextResponse.json({error: 'server error'}, {status: 500});
    }
}