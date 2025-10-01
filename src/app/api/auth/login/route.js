import { connectToDb } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt"
import { NextRequest, NextResponse } from "next/server";

connectToDb();

export async function POST(request) {

    try {
        const reqBody = await request.json();

        const {email, password} = reqBody;

        console.log(reqBody);

        const user = await User.findOne({email});

        if (user) {
            // TODO - add logic here to check password
            console.log(user);
        }

        return NextResponse.json(user);

    } catch (error) {
        console.log('error:', error);
        return NextResponse.json({error: error.message});
    }
}