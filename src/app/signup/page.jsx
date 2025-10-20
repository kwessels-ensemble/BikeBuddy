"use client";

// import Link from "next/link";
import React from 'react';
import { useState, useEffect }  from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import styles from './page.module.css';
import { useAuth } from "@/app/context/AuthContext";
import Spinner from "@/components/Spinner/Spinner";

// export const metadata = {
//   title: "Sign Up",
//   description: "Create a Ridebuddy account"
// };

// TODO - add this logic back again after adding client logic to a child component
export default function SignUp() {

    const router = useRouter();

    // store user in state
    const defaultUser = {
        email: "",
        username: "",
        password: ""
    };

    const { authUser, authLoading } = useAuth();


    const [user, setUser] = useState(defaultUser);
    const [errors, setErrors] = useState({});



    // if user already authenticated, redirect to ride feed
    useEffect(() => {
        if (!authLoading && authUser) {
            router.push('/ride-feed');
        }
    }, [authUser, authLoading, router]);

    // return loading before redirect as needed
    if (authLoading) {
        return (
            // <p>Loading...</p>
                <div className='loading-container'>
                   <Spinner></Spinner>
               </div>
        )
    }
    if (authUser) {
        return null;
    }

    const validate = (user) => {

        const {email, username, password} = user;

        const newErrors = {};

        //username
        if (!username || username.length <=3  || username.length > 20) {
            newErrors.username = 'Username must be 4-20 characters';
        }
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


    const handleSignUp = async () => {
        try {
            const response = await axios.post('/api/auth/signup', user);
            // console.log(response);

            // redirect to login on successful signup
            router.push('/login');

        } catch (err) {
            // console.log('sign up failed:', err);
            // note this will catch more specific backend errors
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
            handleSignUp();
        }
    }

    return (
        <div className='container'>
            <h1>Sign Up</h1>
            <form className={styles.form}>

                <p className={styles.note}>* Required fields</p>

                <label htmlFor="email">Email <span className={styles.required}>*</span> </label>
                <input
                    id="email"
                    type="text"
                    placeholder="email"
                    value={user.email}
                    onChange={(e) => setUser({...user, email: e.target.value})}
                    >
                </input>
                {errors.email && <span className={styles.error}>{errors.email}</span>}

                <label htmlFor="username">Username <span className={styles.required}>*</span></label>
                <input
                    id="username"
                    type="text"
                    placeholder="username"
                    value={user.username}
                    onChange={(e) => setUser({...user, username: e.target.value})}
                    >
                </input>
                {errors.username && <span className={styles.error}>{errors.username}</span>}

                <label htmlFor="password">Password <span className={styles.required}>*</span></label>
                <input
                    id="password"
                    type="password"
                    placeholder="password"
                    value={user.password}
                    onChange={(e) => setUser({...user, password: e.target.value})}
                    >
                </input>
                {errors.password && <span className={styles.error}>{errors.password}</span>}

                <button className='btn-primary' onClick={onSubmit}>Sign Up</button>

                {errors.general && <span className={styles.error}>{errors.general}</span>}

            </form>
        </div>
    )
}

