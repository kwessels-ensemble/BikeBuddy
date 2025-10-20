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

        // console.log(reqBody);

        // get auth user
        const token = request.cookies.get('token')?.value;
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({error: "unauthorized"}, {status: 401});
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

        // check for field errors
        const errors = {};
        if (!reqBody.title) {
            errors.title = 'Title is required.'
        }
        if (!reqBody.type || !typeOptions.includes(reqBody.type) ) {
            errors.type = 'Type (mtb, gravel, or road) is required.'
        }
        if (!reqBody.location || !reqBody.location.city || !reqBody.location.state || !locationOptions.some(location => location.city === reqBody.location.city && location.state === reqBody.location.state )) {
            errors.location = 'Location (city, state) is required'
        }
        if (reqBody.link && !validateLink(reqBody.link)) {
            errors.link = 'Link is invalid.';
        }

        if (Object.keys(errors).length > 0) {
                    return NextResponse.json({ errors}, {status: 400});
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