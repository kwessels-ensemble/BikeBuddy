"use client";

// import Link from "next/link";
import { useState } from "react";
// import {useRouter} from "next/navigation";
import axios from "axios";

// export const metadata = {
//   title: "Sign Up",
//   description: "Create a Ridebuddy account"
// };

// TODO - add this logic back again after adding client logic to a child component
export default function SignUp() {

    // store user in state
    const defaultUser = {
        email: "",
        username: "",
        password: ""
    };

    const [user, setUser] = useState(defaultUser);

    const onSignUp = async (e) => {
        // TODO - add sign up db logic here
        // also add try, catch, finally logic
        // + loading logic, button disabling logic
        // + any redirect logic after successful sign up
        try {
            e.preventDefault();

            console.log(user);

            const response = await axios.post('/api/auth/signup', user);
            console.log(response);

            // reset user
            setUser(defaultUser);

        } catch (err) {
            console.log('sign up failed:', err);
        }

    }

    return (
        <div>
            <h1>Sign Up</h1>
            <form className="signup-form">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="text"
                    placeholder="email"
                    value={user.email}
                    onChange={(e) => setUser({...user, email: e.target.value})}
                    >
                </input>

                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    placeholder="username"
                    value={user.username}
                    onChange={(e) => setUser({...user, username: e.target.value})}
                    >
                </input>

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="password"
                    value={user.password}
                    onChange={(e) => setUser({...user, password: e.target.value})}
                    >
                </input>
                <button onClick={onSignUp}>Sign Up</button>
            </form>
        </div>
    )
}

