"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavBar.module.css";


function NavBar() {
    // get current route for styling logic
    const pathname = usePathname();

    const onLogout = async (e) => {
        e.preventDefault();
        // TODO - add logout db logic here
        // also add try, catch, finally logic
        // + loading logic, button disabling logic
        // + any redirect logic after successful logout
        console.log('clicked log out!');
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
                <Link href="/rides"
                    className={
                        pathname === "/rides"
                        ? `${styles.navLink} ${styles.navLinkActive}`
                        : styles.navLink
                    }>
                    Rides
                </Link>
                <Link href="/scheduled-rides"
                    className={
                        pathname === "/scheduled-rides"
                        ? `${styles.navLink} ${styles.navLinkActive}`
                        : styles.navLink
                    }>
                    Scheduled Rides
                </Link>

                <Link href="/feed"
                    className={
                        pathname === "/feed"
                        ? `${styles.navLink} ${styles.navLinkActive}`
                        : styles.navLink
                    }>
                    Feed
                </Link>
                <button onClick={onLogout}>Logout</button>
            </nav>
    )
}

export default NavBar;