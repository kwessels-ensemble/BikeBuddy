import { connectToDb } from "@/lib/mongodb";
import ScheduledRide from "@/models/ScheduledRide";
import { NextResponse } from "next/server";
import {verifyToken} from "@/lib/auth";
import { truncates } from "bcryptjs";


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
        const query = { isPublic: true, isCancelled: false};
        // time filters (note - 'all' means no date filter needed)
        if (time === 'upcoming') {
            query.eventTime = {$gte: now};
        } else if (time === 'past') {
            query.eventTime = {$lte: now};
        }
        // type filter
        if (type && ['mtb', 'gravel', 'road'].includes(type)) {
            query['rideDetails.type'] = type;
        }


        // sorting logic dependent on time filter
        let sortOption = {};
        if (time === 'past') {
            sortOption.eventTime = -1;
        // TODO - add logic to handle separated past and upcoming on 'all' page
        // for now, sort in chronological order for anything aside from 'past'
        } else {
            sortOption.eventTime = 1;
        }

        const publicRides = await ScheduledRide.find(query)
            .populate('organizer', 'username')
            .populate('participants', 'username')
            .sort(sortOption);

        return NextResponse.json({publicRides}, {status: 200});

    } catch (error) {
        console.error('fetch public rides error:', error);
        return NextResponse.json({error: 'server error'}, {status: 500});
    }
}
