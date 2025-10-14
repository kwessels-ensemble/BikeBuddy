
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { DateTime } from "luxon";
import ScheduledRideDetail from "@/components/Rides/ScheduledRide/ScheduledRideDetail";
import { useAuth } from "@/app/context/AuthContext";
import Spinner from "@/components/Spinner/Spinner";

// export const metadata = {
//   title: "Public Ride Details",
//   description: "View a public ride."
// };

export default function PublicRide() {

    const router = useRouter();
    const { rideId } = useParams();

    // get auth user
    const { authUser, authLoading } = useAuth();
    // define state
    const [publicRide, setPublicRide] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchPublicRide () {
        try {
            const response = await axios.get(`/api/public-rides/${rideId}`);
            console.log(response);

            const rideData = response.data;
            setPublicRide(rideData);
        } catch (err) {
            console.log('failed to fetch public ride:', err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect( () => {
        fetchPublicRide();
    }, []);


    const handleJoin = async (rideId) => {
        try {
            setIsLoading(true);
            console.log('clicked join!');
            const response = await axios.post(`/api/scheduled-rides/${rideId}/join`);
            console.log(response);
            const updatedRide = response.data;
            // update data on page
            setPublicRide(prev => prev._id.toString() === rideId.toString()
                            ?
                            {...updatedRide}
                            : prev)

        } catch (err) {
            console.log('failed to join ride:', err);
        } finally {
            setIsLoading(false);
        }
    }

    const handleLeave = async (rideId) => {
        try {
            setIsLoading(true);
            console.log('clicked leave!');
            const response = await axios.delete(`/api/scheduled-rides/${rideId}/leave`);
            console.log(response);
            const updatedRide = response.data;
            // update data on page
            setPublicRide(prev => prev._id.toString() === rideId.toString()
                            ?
                            {...updatedRide}
                            : prev)

        } catch (err) {
            console.log('failed to leave ride:', err);
        } finally {
            setIsLoading(false);
        }
    }

    // confirm we have authUser prior to running other logic
    if (authLoading) {
        // return (<p>Loading user... </p>);
        return (
            <div className='loading-container'>
                <Spinner></Spinner>
            </div>
        )
    }

    return (
        <div className='container'>
            <button className='btn-secondary' onClick={() => router.push('/ride-feed')}>Back to Ride Feed</button>

            <h1>Ride Details</h1>

            {isLoading === true ? (
                // <p>Loading...</p>
                <Spinner></Spinner>
            ) : (!publicRide ? (
                <p>No public ride found</p>
            ) :
                (<ScheduledRideDetail
                    authUser={authUser}
                    scheduledRide={publicRide}
                    handleJoin={handleJoin}
                    handleLeave={handleLeave}
                    >
                </ScheduledRideDetail>
                )
            )}

        </div>
    )
};

