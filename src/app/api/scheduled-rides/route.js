import { connectToDb } from "@/lib/mongodb";
import ScheduledRide from "@/models/ScheduledRide";
import { NextResponse } from "next/server";
import {verifyToken} from "@/lib/auth";


export async function GET(request) {

    try {

        await connectToDb();

        // get query params
        const { searchParams } = new URL(request.url);
        const time = searchParams.get('time'); //past, upcoming (otherwise default to all rides)
        const type = searchParams.get('type');
        const now = new Date();

        // get auth user
        const token = request.cookies.get('token')?.value;
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({error: "unauthorized"}, {status: 401});
        }

        // build ride query
        // defaults
        const query = { organizer: decoded.id, isCancelled: false};
        // time filter (note - 'all' means no date filter needed)
        if (time === 'upcoming') {
            query.eventTime = {$gte: now};
        } else if (time === 'past') {
            query.eventTime = {$lte: now};
        }
        // type filter
        if (type && ['mtb', 'gravel', 'road'].includes(type)) {
            query['rideDetails.type'] = type;
        }
        // no filter needed if type is 'all'

        // sorting logic dependent on time filter
        let sortOption = {};
        if (time === 'past') {
            sortOption.eventTime = -1;
        // TODO - add logic to handle separated past and upcoming on 'all' page
        } else {
            sortOption.eventTime = 1;
        }

        // TODO - add limit and pagination
        const scheduledRides = await ScheduledRide.find(query)
            .populate('organizer', 'username')
            .populate('participants', 'username')
            .sort(sortOption);

        return NextResponse.json({scheduledRides}, {status: 200});

    } catch (error) {
        console.error('fetch rides error:', error);
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
            timeZone: reqBody.timeZone,
            // add organizer as first participant
            participants: [decoded.id],
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