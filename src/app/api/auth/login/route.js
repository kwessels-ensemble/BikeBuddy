import { connectToDb } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt"
import { NextRequest, NextResponse } from "next/server";
import {maxAge, createToken} from "@/lib/auth";

// connectToDb();

export async function POST(request) {

    try {
        // need to explicitly connect to db within function?
        await connectToDb();

        const reqBody = await request.json();

        const {email, password} = reqBody;

        console.log(reqBody);

        // return error if any fields are missing
        if (!email || !password) {
            console.log('Error: all fields are required')
            return NextResponse.json({errors: 'all fields are required'}, {status: 400});
        }

        // Validation checks for length of password and valid email
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            errors.email = 'Invalid email';
        }
        if (!password || password.length < 8) {
            errors.password = 'Password must be at least 8 characters.'
        }

        if (Object.keys(errors).length > 0) {
            return NextResponse.json({errors}, {status: 400});
        }

        const user = await User.findOne({email});

        if (!user) {
            return NextResponse.json({errors: {email: 'No account with this email'}}, {status: 401});
        }

        console.log(user);

        // check password
        const auth = await bcrypt.compare(password, user.password);

        if (auth) {
            // login user by creating jwt token
            const token = createToken(user._id);

            const response =  NextResponse.json({
                    message: 'User logged in successfully',
                    email: user.email,
                    userId: user._id},
                    {status: 200})
            // set jwt token
            response.cookies.set('token', token, {
                httpOnly: true,
                maxAge: maxAge,
                path: "/"
            })

            return response;
        }

        return NextResponse.json({errors: {password: 'Incorrect password'}}, {status: 401});


    } catch (error) {
        console.error('login error:', error);
        return NextResponse.json({errors: 'server error'}, {status: 500});
    }
}