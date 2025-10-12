import { connectToDb } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server";

// connectToDb();

export async function POST(request) {

    try {
        // need to explicitly connect to db within function?
        await connectToDb();

        const reqBody = await request.json();

        const {email, username, password} = reqBody;

        console.log(reqBody);

        // return error if any fields are missing
        if (!username || !email || !password) {
            console.log('Error: all fields are required')
            return NextResponse.json({errors: 'all fields are required'}, {status: 400});
        }

        // TODO - add logic to check for length of password, username, and valid email
        const errors = {};
        if (!username || username.length <= 3 || username.length >20) {
            errors.username = 'Username must be 4-20 characters.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            errors.email = 'Invalid email';
        }
        if (!password || password.length < 8) {
            errors.password = 'Password must be at least 8 characters.'
        }

        if (Object.keys(errors).length > 0) {
            return NextResponse.json({ errors}, {status: 400});
        }


        // return error if email already exists
        let matchingUser = await User.findOne({email});
        if (matchingUser) {
            // console.log('Error: user with this email already exists');
            return NextResponse.json({errors: {email: 'This email is already taken.'}}, {status: 400});
        }

        // return error if username already exists
        matchingUser = await User.findOne({username});
        if (matchingUser) {
            // console.log('Error: user with this username already exists');
            return NextResponse.json({errors: {username: 'This username is already taken.'}}, {status: 400});
        }

        // add logic here to create the user in the db
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // console.log('sign up success')

        return NextResponse.json({
                            message: "user created successfully",
                            userId: newUser._id,
                            email: email},
                            {status: 201});

    } catch (error) {
        console.error('sign up error:', error);
        return NextResponse.json({ error: 'Server error'}, {status: 500});
    }
}