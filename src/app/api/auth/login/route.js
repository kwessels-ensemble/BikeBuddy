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

        // return error if any fields are missing
        if (!email || !password) {
            console.log('Error: all fields are required')
            return NextResponse.json({error: 'all fields are required'}, {status: 400});
        }

        const user = await User.findOne({email});

        if (!user) {
            return NextResponse.json({error: 'no account with this email'}, {status: 401});
        }

        console.log(user);

        // check password
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return NextResponse.json({
                message: 'user logged in successfully',
                email: user.email,
                userId: user._id},
                {status: 200})
        }

        return NextResponse.json({error: 'incorrect password'}, {status: 401});


    } catch (error) {
        console.error('login error:', error);
        return NextResponse.json({error: 'server error'}, {status: 500});
    }
}