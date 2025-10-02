import { connectToDb } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import {maxAge, createToken} from "@/lib/auth";


export async function POST(request) {

    try {

        //logout by resetting token
        // console.log('logout route hit')
        const response = NextResponse.json({message: 'logged out'}, {status: 200});
        response.cookies.set('token', '', {
            httpOnly: true,
            path: "/",
            maxAge: 1
        });

        return response;

    } catch (error) {
        console.error('logout error:', error);
        return NextResponse.json({error: 'server error'}, {status: 500});
    }
}