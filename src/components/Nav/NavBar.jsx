"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavBar.module.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";
import Spinner from "../Spinner/Spinner";


export default function NavBar() {
    // get current route for styling logic
    const pathname = usePathname();
    // router for redirect
    const router = useRouter();

    // const [isLoading, setIsLoading] = useState(false);

    const { authUser, setAuthUser, authLoading } = useAuth();

    const onLogout = async (e) => {
        try {
            e.preventDefault();
            // setIsLoading(true);
            // console.log('clicked log out!');
            const response = await axios.post('/api/auth/logout', {}, {withCredentials: true});
            console.log(response);
            setAuthUser(null);
            //redirect
            router.push('/login');



        } catch (err) {
            console.error('logout error:', err)

        }
        // finally {
        //     setIsLoading(false);
        // }
    }

    if (authLoading) {
        return null;
    }

    return (
            <nav className={styles.nav}>
                <div className={`container ${styles.inner}`}>
                    <div className='leftItems'>
                        <Link
                            href="/"
                            className={
                                pathname === "/"
                                ? `${styles.navLink} ${styles.appName} ${styles.navLinkActive}`
                                : `${styles.navLink} ${styles.appName}`
                            }>
                            🚲 BikeBuddy
                        </Link>

                        {authUser ? (
                        <>
                            <Link href="/saved-rides"
                                className={
                                    pathname === "/saved-rides"
                                    ? `${styles.navLink} ${styles.navLinkActive}`
                                    : styles.navLink
                                }>
                                Saved Rides
                            </Link>

                            <Link href="/scheduled-rides"
                                className={
                                    pathname === "/scheduled-rides"
                                    ? `${styles.navLink} ${styles.navLinkActive}`
                                    : styles.navLink
                                }>
                                Scheduled Rides
                            </Link>

                            <Link href="/ride-feed"
                                className={
                                    pathname === "/ride-feed"
                                    ? `${styles.navLink} ${styles.navLinkActive}`
                                    : styles.navLink
                                }>
                                Ride Feed
                            </Link>

                            {/* <button className='btn-secondary-destructive' onClick={onLogout}>Logout</button> */}
                        </>
                        ) :
                        (
                        <>
                        </>
                        )}
                    </div>

                    <div className='rightItems'>
                        {authUser ?
                            (
                            <>
                                <button className='btn-secondary-destructive' onClick={onLogout}>Logout</button>
                            </>
                            )
                        : (
                            <>
                                <Link href="/login"
                                    className={
                                        pathname === "/login"
                                        ? `${styles.navLink} ${styles.navLinkActive}`
                                        : styles.navLink
                                    }>
                                    Login
                                </Link>

                                <Link href="/signup"
                                    className={
                                        pathname === "/signup"
                                        ? `${styles.navLink} ${styles.navLinkActive}`
                                        : styles.navLink
                                    }>
                                    Sign Up
                                </Link>
                            </>
                        )
                        }

                    </div>

                </div>
            </nav>
    )
}
