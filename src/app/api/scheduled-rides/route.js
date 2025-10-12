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
        // for now, sort in chronological order for anything aside from 'past'
        } else {
            sortOption.eventTime = 1;
        }

        // TODO - add pagination and limit for V1
        const scheduledRides = await ScheduledRide.find(query)
            .populate('organizer', 'username')
            .populate('participants', 'username')
            .sort(sortOption)
            .limit(50); // limit for MVP

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


        console.log(reqBody);

        // get auth user
        const token = request.cookies.get('token')?.value;
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({error: "unauthorized"}, {status: 401});
        }

        // validation -
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

        // validate fields
        const errors = {};
        if (!reqBody.eventTime) {
            errors.eventTime = 'eventTime is required.'
        }
        // check that eventTime is in future
        if (reqBody.eventTime) {
            const currentTimeUTC = DateTime.utc();
            const eventTimeUTC = DateTime.fromJSDate(reqBody.eventTime).toUTC();
            if (eventTimeUTC <= currentTimeUTC) {
                errors.eventTime = 'eventTime must be a future date time.'
            }
        }
        if (!reqBody.timeZone) {
            errors.timeZone = 'timeZone is required.'
        }
        if (!reqBody.isPublic) {
            errors.isPublic = 'isPublic is required.'
        }
        if (!reqBody.rideDetails.title) {
            errors.rideDetails.title = 'rideDetails.title is required.'
        }
        if (!reqBody.rideDetails.type || !typeOptions.includes(reqBody.rideDetails.type)) {
            errors.rideDetails.type = 'rideDetails.type (mtb, gravel, road) is required.'
        }
        if (!reqBody.rideDetails.location || !reqBody.rideDetails.location.city || !reqBody.rideDetails.location.state || !locationOptions.some(location => location.city === reqBody.rideDetails.location.city && location.state === reqBody.rideDetails.location.state )) {
            errors.location = 'rideDetails.location (city, state) is required'
        }
        if (reqBody.rideDetails.link && !validateLink(reqBody.rideDetails.link)) {
            errors.link = 'link is invalid.';
        }

        if (Object.keys(errors).length > 0) {
            return NextResponse.json({ errors}, {status: 400});
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