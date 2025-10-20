
"use client";

import axios from "axios";
import {createContext, useContext, useEffect, useState} from "react";

const AuthContext = createContext();

export function AuthProvider( { children }) {

    const [authUser, setAuthUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const fetchAuthUser = async () => {
        try {
            const response = await axios.get('/api/auth/me');
            // console.log(response);
            setAuthUser(response.data.user);
        } catch (err) {
            setAuthUser(null);
        } finally {
            setAuthLoading(false);
        }
    }

    useEffect(() => {
        fetchAuthUser();
    }, []);

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

// export a helper function to be used in components
export function useAuth() {
    return useContext(AuthContext);
}