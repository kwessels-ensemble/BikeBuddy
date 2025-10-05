import { connectToDb } from "@/lib/mongodb";
import User from "@/models/User";
import ScheduledRide from "@/models/ScheduledRide";
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

        // TODO - build out function for getting cancelled rides too.. maybe api query string
        // by default, get rides that have not been cancelled
        // by default, this route is to get the auth user's scheduled rides that they own as "organizer"
        const scheduledRides = await ScheduledRide.find({organizer: decoded.id, isCancelled: false});
        return NextResponse.json({scheduledRides}, {status: 200});

    } catch (error) {
        console.error('rides error:', error);
        return NextResponse.json({error: 'server error'}, {status: 500});
    }
}

export async function POST(request) {

    try {

        await connectToDb();

        // get details from request body
        const reqBody = await request.json();

        // note - will need to add checks for the required fields here and/or within the ui form
        // expecting: title, description, link, type, tags, notes, location
        // defaults/auto create: _id, createdAt, updatedAt, isDeleted, ...and userId added below


        console.log(reqBody);

        // get auth user
        const token = request.cookies.get('token')?.value;
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({error: "unauthorized"}, {status: 401});
        }

        // create new scheduled ride
        const scheduledRide = new ScheduledRide({
            organizer: decoded.id,
            isPublic: reqBody.isPublic, // by default false
            eventTime: reqBody.eventTime,
            // participants by default [] at creation time
            // isCancelled by default false at creation time
            // other cancelled fields null at creation time
            rideDetails: reqBody.rideDetails
        })

        // save ride to the db
        await scheduledRide.save();

        return NextResponse.json({scheduledRide}, {status: 201});

    } catch (error) {
        console.error('error scheduling ride:', error);
        return NextResponse.json({error: 'server error, failed to schedule ride'}, {status: 500});
    }
}