import { connectToDb } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import {verifyToken} from "@/lib/auth";

// connectToDb();

export async function GET(request) {

    try {
        // need to explicitly connect to db within function?
        await connectToDb();

        // get auth user
        const token = request.cookies.get('token')?.value;
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({error: "unauthorized"}, {status: 401});
        }

        // TODO - add logic here to fetch rides from db for the auth user
        // tmp-  return user id
        return NextResponse.json({userId: decoded.id}, {status: 200});

    } catch (error) {
        console.error('rides error:', error);
        return NextResponse.json({error: 'server error'}, {status: 500});
    }
}