"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";


export default function LogoutButton() {
    // router for redirect
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const { authUser, setAuthUser, authLoading } = useAuth();

    const onLogout = async (e) => {
        try {
            e.preventDefault();

            setIsLoading(true);

            // set auth user to null to clear page content immediately
            const prevUser = authUser;
            setAuthUser(null);
            // console.log('clicked log out!');
            const response = await axios.post('/api/auth/logout', {}, {withCredentials: true});
            // console.log(response);
            //redirect to home page
            router.push('/');
        } catch (err) {
            console.error('logout error:', err)
            // revert clear user if logout failed
            setAuthUser(prevUser);
        }
        finally {
            setIsLoading(false);
        }
    }


    return (
        <button
            className='btn-secondary-destructive'
            onClick={onLogout}
            disabled={isLoading}
            >
            {isLoading ? 'Logging out...' : 'Logout'}
        </button>
    )
}
