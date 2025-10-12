
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { DateTime } from "luxon";
import ScheduledRideDetail from "@/components/Rides/ScheduledRide/ScheduledRideDetail";
import { useAuth } from "@/app/context/AuthContext";

// export const metadata = {
//   title: "Scheduled Ride Details",
//   description: "View a scheduled ride."
// };

export default function ScheduledRide() {

    const router = useRouter();
    const { rideId } = useParams();

    // get auth user
    const { authUser, authLoading } = useAuth();
    // define state
    const [scheduledRide, setScheduledRide] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchScheduledRide () {

        try {
            const response = await axios.get(`/api/scheduled-rides/${rideId}`);
            console.log(response);

            const rideData = response.data;

            setScheduledRide(rideData);

        } catch (err) {
            console.log('failed to fetch scheduled ride:', err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect( () => {
        fetchScheduledRide();
    }, []);

    async function handleCancel(rideId) {
        try {
            const confirmed = window.confirm('Are you sure you want to cancel this ride?');
            if (!confirmed) {
                return;
            }
            const response = await axios.delete(`/api/scheduled-rides/${rideId}`);
            console.log(response);
            // reload
            // setScheduledRide((prev) =>
            //     prev.filter((ride) =>ride._id !== rideId));
            // redirect back to scheduled rides
            router.push('/scheduled-rides');
            // TODO - consider adding a message to inform user deletion was successfuly

        } catch (err) {
            console.log('failed to cancel ride:', err);
        }
    }

    const handleEdit = (rideId) => {
        router.push(`/scheduled-rides/${rideId}/edit`);
    }

    if (authLoading) {
        return (<p>Loading user... </p>);
    }

    return (
        <div>
            <button onClick={() => router.push('/scheduled-rides')}>Back to Scheduled Rides</button>
            <h1>Scheduled Ride</h1>

            {isLoading === true ? (
                <p>Loading...</p>
            ) : (!scheduledRide ? (
                <p>No scheduled ride found</p>
            ) : (
                <ScheduledRideDetail
                    authUser={authUser}
                    scheduledRide={scheduledRide}
                    handleCancel={handleCancel}
                    handleEdit={handleEdit}
                    >
                </ScheduledRideDetail>
            )
            )}

        </div>
    )
};

