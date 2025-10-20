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

        const ride = await SavedRide.findOne({_id: rideId, isDeleted: false});

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

        if (!ride || ride.isDeleted) {
            return NextResponse.json({message: "Ride not found"}, {status: 404})
        }

        if (decoded.id?.toString() !== ride.userId?.toString()) {
            return NextResponse.json({error: "Forbidden"}, {status: 403});
        }

        // await ride.deleteOne();

        // delete ride by setting isDeleted=true
        ride.isDeleted = true;

        await ride.save();

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
        if (!ride || ride.isDeleted) {
            return NextResponse.json({message: "Ride not found"}, {status: 404})
        }

        // check user owns ride
        if (decoded.id?.toString() !== ride.userId?.toString()) {
            return NextResponse.json({error: "Forbidden"}, {status: 403});
        }

        // data validation for required fields and formats
        const locationOptions = [
        {city: 'San Francisco', state: 'CA'},
        {city: 'Santa Cruz', state: 'CA'},
        {city: 'Pacifica', state: 'CA'},
        {city: 'Berkeley', state: 'CA'},
        {city: 'Oakland', state: 'CA'},
        {city: 'Fairfax', state: 'CA'}
        ]

        const typeOptions = ['mtb', 'gravel', 'road'];

        const validateLink = (link) => {
            try {
                new URL(link);
                return true;
            } catch {
                return false;
            }
        }

        // validation logic -
        const errors = {};
        if (rideUpdates.title && rideUpdates.title === "") {
            errors.title = 'Title is required.'
        }
        if (rideUpdates.type && !typeOptions.includes(rideUpdates.type) ) {
            errors.type = 'Type must be mtb, gravel, or road.'
        }
        if (rideUpdates.location && (!rideUpdates.location.city || !rideUpdates.location.state || !locationOptions.some(location => location.city === rideUpdates.location.city && location.state === rideUpdates.location.state ))) {
            errors.location = 'Location (city, state) is required'
        }
        if (rideUpdates.link && !validateLink(rideUpdates.link)) {
            errors.link = 'Link is invalid.';
        }

        if (Object.keys(errors).length > 0) {
            return NextResponse.json({ errors}, {status: 400});
            }

        // update logic -
        const validFields = ['title', 'description', 'link', 'type', 'notes', 'location'];
        for (let key of Object.keys(rideUpdates)) {
            if (validFields.includes(key)) {
                ride[key] = rideUpdates[key];
            }
        }

        await ride.save();

        return NextResponse.json(ride, {status: 200});

    } catch (error) {
        console.error('error updating ride:', error);
        return NextResponse.json({error: 'server error'}, {status: 500});
    }
}