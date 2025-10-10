import { connectToDb } from "@/lib/mongodb";
import User from "@/models/User";
import SavedRide from "@/models/SavedRide";
import { NextResponse } from "next/server";
import {verifyToken} from "@/lib/auth";


export async function GET(request) {

    try {

        await connectToDb();

        // get query params
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');

        // get auth user
        const token = request.cookies.get('token')?.value;
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({error: "unauthorized"}, {status: 401});
        }

        // build ride query
        // defaults
        const query = { userId: decoded.id, isDeleted: false };
        // type filter
        if (type && ['mtb', 'gravel', 'road'].includes(type)) {
            query.type = type;
        }

        // TODO - add pagination and limit for V1
        const savedRides = await SavedRide.find(query)
                                            .sort({createdAt: -1})
                                            .limit(50); // limit for MVP

        return NextResponse.json({savedRides}, {status: 200});

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
        // expecting: title, description, link, type, notes, location
        // defaults/auto create: _id, createdAt, updatedAt, isDeleted, ...and userId added below


        console.log(reqBody);

        // get auth user
        const token = request.cookies.get('token')?.value;
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({error: "unauthorized"}, {status: 401});
        }

        // create new saved ride
        const savedRide = new SavedRide({
            userId: decoded.id,
            title: reqBody.title,
            description: reqBody.description,
            link: reqBody.link,
            type: reqBody.type,
            notes: reqBody.notes,
            location: reqBody.location
        })

        // save ride to the db
        await savedRide.save();

        return NextResponse.json({savedRide}, {status: 201});

    } catch (error) {
        console.error('error adding new saved ride:', error);
        return NextResponse.json({error: 'server error, failed to save ride'}, {status: 500});
    }
}