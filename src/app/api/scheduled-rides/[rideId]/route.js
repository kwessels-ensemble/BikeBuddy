import { connectToDb } from "@/lib/mongodb";
import ScheduledRide from "@/models/ScheduledRide";
import User from "@/models/User";
import { NextResponse } from "next/server";
import {verifyToken} from "@/lib/auth";
import mongoose from "mongoose";
import { DateTime } from "luxon";



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

        // const ride = await ScheduledRide.findOne({organizer: decoded.id, _id: rideId, isCancelled: false});

        const ride = await ScheduledRide.findById(rideId)
            .populate('organizer', 'username')
            .populate('participants', 'username');

        // check if the ride id exists (and is not cancelled)
        if (!ride || ride.isCancelled) {
            return NextResponse.json({message: "Scheduled ride not found"}, {status: 404})
        }

        // check if the auth user has access to this ride (ie. is the organizer)
        if (decoded.id?.toString() !== ride.organizer._id?.toString()) {
            return NextResponse.json({error: "Forbidden"}, {status: 403});
        }

        return NextResponse.json(ride, {status: 200});

    } catch (error) {
        console.error('error fetching scheduled ride:', error);
        return NextResponse.json({error: 'server error'}, {status: 500});
    }
}

export async function DELETE(request, { params}) {
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

        const ride = await ScheduledRide.findById(rideId);

        // handling ride cancelled or not found -
        if (!ride || ride.isCancelled) {
            return NextResponse.json({message: "Scheduled ride not found"}, {status: 404})
        }

        // handling auth user not being the owner -
        if (decoded.id?.toString() !== ride.organizer?.toString()) {
            return NextResponse.json({error: "Forbidden"}, {status: 403});
        }

        // TODO - add logic to check if eventTime in past (already happend) and prevent updates
        // logic to check if eventTime in past (already happend) and prevent updates
        const currentTimeUTC = DateTime.utc();
        const eventTimeUTC = DateTime.fromJSDate(ride.eventTime).toUTC();
        if (eventTimeUTC <= currentTimeUTC) {
            return NextResponse.json({error: 'Cannot edit a ride that already happened'}, {status: 400});
        }

        // unschedule/cancel ride by setting cancelled flags-
        ride.isCancelled = true;
        ride.cancelledAt = new Date();
        ride.cancelledBy = decoded.id;
        //TODO - add request json body where user can input cancellation reason etc.
        ride.cancellationReason = '';

        await ride.save();

        return NextResponse.json({message: 'Ride successfully cancelled'}, {status: 200});

    } catch (error) {
        console.error('error cancelling ride:', error);
        return NextResponse.json({error: 'server error'}, {status: 500});
    }

}


export async function PATCH(request, { params }) {

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

        // get update details from request body
        const rideUpdates = await request.json();

        // find corresponding ride
        const ride = await ScheduledRide.findById(rideId);

        // check ride exists
        if (!ride || ride.isCancelled) {
            return NextResponse.json({message: "Scheduled ride not found"}, {status: 404})
        }

        // check auth user is the ride organizer
        if (decoded.id?.toString() !== ride.organizer?.toString()) {
            return NextResponse.json({error: "Forbidden"}, {status: 403});
        }

        // logic to check if eventTime in past (already happend) and prevent updates
        const currentTimeUTC = DateTime.utc();
        const eventTimeUTC = DateTime.fromJSDate(ride.eventTime).toUTC();
        if (eventTimeUTC <= currentTimeUTC) {
            return NextResponse.json({error: 'Cannot edit a ride that already happened'}, {status: 400});
        }

        // update logic -
        const validFields = ['isPublic', 'eventTime', 'timeZone'];
        const validRideDetailsFields = ['title', 'description', 'link', 'type', 'notes', 'location'];
        // update top-level ride fields
        for (let key of Object.keys(rideUpdates)) {
            if (validFields.includes(key)) {
                ride[key] = rideUpdates[key];
            }
        }
        // update nested rideDetails fields
        if (rideUpdates.rideDetails) {
            for (let key of Object.keys(rideUpdates.rideDetails)) {
                if (validRideDetailsFields.includes(key)) {
                    ride.rideDetails[key] = rideUpdates.rideDetails[key];
                }
            }
        }

        await ride.save();

        return NextResponse.json(ride, {status: 200});

    } catch (error) {
        console.error('error updating scheduled ride:', error);
        return NextResponse.json({error: 'server error'}, {status: 500});
    }
}