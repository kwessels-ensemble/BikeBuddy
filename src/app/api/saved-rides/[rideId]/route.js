import { connectToDb } from "@/lib/mongodb";
import User from "@/models/User";
import SavedRide from "@/models/SavedRide";
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

        const ride = await SavedRide.findById(rideId);

        if (!ride) {
            return NextResponse.json({message: "Ride not found"}, {status: 404})
        }

        if (decoded.id?.toString() !== ride.userId?.toString()) {
            return NextResponse.json({error: "Forbidden"}, {status: 403});
        }

        return NextResponse.json(ride, {status: 200});

    } catch (error) {
        console.error('error fetching ride:', error);
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

        const ride = await SavedRide.findById(rideId);

        if (!ride) {
            return NextResponse.json({message: "Ride not found"}, {status: 404})
        }

        if (decoded.id?.toString() !== ride.userId?.toString()) {
            return NextResponse.json({error: "Forbidden"}, {status: 403});
        }

        await ride.deleteOne();

        return NextResponse.json({message: 'Ride successfully deleted'}, {status: 200});

    } catch (error) {
        console.error('error deleting ride:', error);
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
        const ride = await SavedRide.findById(rideId);

        // check ride exists
        if (!ride) {
            return NextResponse.json({message: "Ride not found"}, {status: 404})
        }

        // check user owns ride
        if (decoded.id?.toString() !== ride.userId?.toString()) {
            return NextResponse.json({error: "Forbidden"}, {status: 403});
        }

        // update logic -
        const validFields = ['title', 'description', 'link', 'type', 'tags', 'notes', 'location'];
        for (let key of Object.keys(rideUpdates)) {
            if (validFields.includes(key)) {
                ride[key] = rideUpdates[key];
            }
        }

        await ride.save();

        return NextResponse.json(ride, {status: 200});

    } catch (error) {
        console.error('error fetching ride:', error);
        return NextResponse.json({error: 'server error'}, {status: 500});
    }
}