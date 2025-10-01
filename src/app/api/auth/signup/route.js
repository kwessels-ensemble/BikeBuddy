import { connectToDb } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt"
import { NextRequest, NextResponse } from "next/server";

connectToDb();

export async function POST(request) {

    try {
        const reqBody = await request.json();

        const {email, username, password} = reqBody;

        console.log(reqBody);

        // check if email exists
        let user = await User.findOne({email});
        if (user) {
            console.log('Error: user with this email already exists');
            return NextResponse.json({error: 'user with this email already exists'})
        }
        // check if username exists
        user = await User.findOne({username});
        if (user) {
            console.log('Error: user with this username already exists');
            return NextResponse.json({error: 'user with this username already exists'})
        }

        // add logic here to create the user in the db
        //
        console.log('sign up success')
        return NextResponse.json({user: {email, username, password}});

    } catch (error) {
        console.log('error:', error);
        return NextResponse.json({error: error.message});
    }
}