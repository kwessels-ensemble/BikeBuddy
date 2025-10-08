
"use client";

// import Link from "next/link";
import { useState } from "react";
import {useRouter} from "next/navigation";
import axios from "axios";


// TODO - add this logic back again after adding client logic to a child component
// export const metadata = {
//   title: "Login",
//   description: "Log in to your Ridebuddy account"
// };

export default function Login() {

    const router = useRouter();

    // store user in state
    const defaultUser = {
        email: "",
        password: ""
    };

    const [user, setUser] = useState(defaultUser);



    const onLogin = async (e) => {
        // TODO - add login db logic here
        // also add try, catch, finally logic
        // + loading logic, button disabling logic
        // + any redirect logic after successful login

        try {
            e.preventDefault();

            console.log(user);

            // reset user to defaults
            setUser(defaultUser);

            const response = await axios.post('/api/auth/login', user);
            console.log(response);
            // redirect to saved rides
            router.push('/saved-rides');

        } catch (err) {
            console.log('login failed:', err);
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form className="login-form">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="text"
                    placeholder="email"
                    value={user.email}
                    onChange={(e) => setUser({...user, email: e.target.value})}
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
                <button onClick={onLogin}>Log In</button>
            </form>
        </div>
    )
}

