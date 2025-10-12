
"use client";

// import Link from "next/link";
import { useState } from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import styles from './page.module.css';

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
    const [errors, setErrors] = useState({});

    const validate = (user) => {

        const {email, password} = user;

        const newErrors = {};

        //email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email.'
        }
        // password
        if (!password || password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        return newErrors;

    }

    const handleLogin = async () => {
        try {
            // e.preventDefault();

            // console.log(user);

            // reset user to defaults
            // setUser(defaultUser);

            const response = await axios.post('/api/auth/login', user);
            // console.log(response);

            // redirect to saved rides
            router.push('/saved-rides');

        } catch (err) {
            console.log('login failed:', err);

            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({general: 'Something went wrong. Please try again.'});
            }

            setUser((prev) => ({...prev, password: ""}));
        }
    }

    const onSubmit = (e) => {

        e.preventDefault();

        // check for validation errors
        const validationErrors = validate(user);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            handleLogin();
        }
    }

    return (
        <div>
            <h1>Login</h1>

            <form className={styles.form}>

                <p className={styles.note}>* Required fields</p>

                <label htmlFor="email">Email<span className={styles.required}>*</span></label>
                <input
                    id="email"
                    type="text"
                    placeholder="email"
                    value={user.email}
                    onChange={(e) => setUser({...user, email: e.target.value})}
                    >
                </input>
                {errors.email && <span className={styles.error}>{errors.email}</span>}

                <label htmlFor="password">Password<span className={styles.required}>*</span></label>
                <input
                    id="password"
                    type="password"
                    placeholder="password"
                    value={user.password}
                    onChange={(e) => setUser({...user, password: e.target.value})}
                    >
                </input>
                {errors.password && <span className={styles.error}>{errors.password}</span>}

                <button onClick={onSubmit}>Log In</button>

                {errors.general && <span className={styles.error}>{errors.general}</span>}

            </form>
        </div>
    )
}

