"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavBar.module.css";
import axios from "axios";
import { useRouter } from "next/navigation";

// TODO - move logout botton/onclick to own component

export default function NavBar() {
    // get current route for styling logic
    const pathname = usePathname();
    // router for redirect
    const router = useRouter();

    const onLogout = async (e) => {
        // TODO - add loading logic, button disabling logic + any redirect logic after logout
        try {
            e.preventDefault();
            // console.log('clicked log out!');
            const response = await axios.post('/api/auth/logout', {}, {withCredentials: true});
            console.log(response);
            //redirect
            router.push('/login');

        } catch (err) {
            console.error('logout error:', err)

        } finally {
            console.log('in finally block. TODO - add functionality')
        }
    }

    return (
            <nav className={styles.nav}>
                <Link
                    href="/"
                    className={
                        pathname === "/"
                        ? `${styles.navLink} ${styles.navLinkActive}`
                        : styles.navLink
                    }>
                    Home
                </Link>
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
                <Link href="/saved-rides"
                    className={
                        pathname === "/rides"
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
                <button onClick={onLogout}>Logout</button>
            </nav>
    )
}
