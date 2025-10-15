"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavBar.module.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";
import Spinner from "../Spinner/Spinner";
import LogoutButton from "./LogoutButton";

export default function NavBar() {
    // get current route for styling logic
    const pathname = usePathname();
    // router for redirect
    const router = useRouter();

    const { authUser, setAuthUser, authLoading } = useAuth();


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
                                <LogoutButton></LogoutButton>
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
