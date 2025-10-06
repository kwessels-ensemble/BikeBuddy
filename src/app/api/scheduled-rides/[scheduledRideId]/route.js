import { connectToDb } from "@/lib/mongodb";
import User from "@/models/User";
import ScheduledRide from "@/models/ScheduledRide";
import { NextResponse } from "next/server";
import {verifyToken} from "@/lib/auth";
import mongoose from "mongoose";



export async function GET(request, { params }) {

    try {

        const { scheduledRideId } = await params;

        await connectToDb();

        if (!mongoose.Types.ObjectId.isValid(scheduledRideId)) {
            return NextResponse.json({error: "Invalid scheduledRideId provided"}, {status: 400});
        }

        // get auth user
        const token = request.cookies.get('token')?.value;
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({error: "unauthorized"}, {status: 401});
        }

        const ride = await ScheduledRide.findOne({_id: scheduledRideId, isCancelled: false});

        if (!ride) {
            return NextResponse.json({message: "Scheduled ride not found"}, {status: 404})
        }

        if (decoded.id?.toString() !== ride.organizer?.toString()) {
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

        const { scheduledRideId } = await params;

        await connectToDb();

        if (!mongoose.Types.ObjectId.isValid(scheduledRideId)) {
            return NextResponse.json({error: "invalid scheduledRideId provided"}, {status: 400});
        }

        // get auth user
        const token = request.cookies.get('token')?.value;
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({error: "unauthorized"}, {status: 401});
        }

        const ride = await ScheduledRide.findById(scheduledRideId);

        if (!ride || ride.isCancelled) {
            return NextResponse.json({message: "Scheduled ride not found"}, {status: 404})
        }

        if (decoded.id?.toString() !== ride.organizer?.toString()) {
            return NextResponse.json({error: "Forbidden"}, {status: 403});
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

        const { scheduledRideId } = await params;

        await connectToDb();

        if (!mongoose.Types.ObjectId.isValid(scheduledRideId)) {
            return NextResponse.json({error: "invalid scheduledRideId provided"}, {status: 400});
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
        const ride = await ScheduledRide.findById(scheduledRideId);

        // check ride exists
        if (!ride || ride.isCancelled) {
            return NextResponse.json({message: "Scheduled ride not found"}, {status: 404})
        }

        // check user owns ride
        if (decoded.id?.toString() !== ride.organizer?.toString()) {
            return NextResponse.json({error: "Forbidden"}, {status: 403});
        }

        // update logic -
        const validFields = ['isPublic', 'eventTime', 'timeZone'];
        const validRideDetailsFields = ['title', 'description', 'link', 'type', 'tags', 'notes', 'location'];
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