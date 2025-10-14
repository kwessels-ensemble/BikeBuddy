"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import SavedRideDetail from "@/components/Rides/SavedRide/SavedRideDetail";
import Spinner from "@/components/Spinner/Spinner";

// export const metadata = {
//   title: "Saved Ride",
//   description: "View a saved ride."
// };

export default function SavedRide() {

    const router = useRouter();
    const { rideId } = useParams();

    // define state
    const [savedRide, setSavedRide] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchSavedRide () {
            try {
                const response = await axios.get(`/api/saved-rides/${rideId}`);
                console.log(response);
                setSavedRide(response.data);

            } catch (err) {
                console.log('failed to get saved ride:', err);
            } finally {
                setIsLoading(false);
            }
        }

    useEffect( () => {
        fetchSavedRide();
    }, []);

    async function handleDelete(rideId) {
        console.log('inside delete')
        try {
            const confirmed = window.confirm('Are you sure you want to delete this ride?');
            if (!confirmed) {
                return;
            }
            const response = await axios.delete(`/api/saved-rides/${rideId}`);
            console.log(response);
            // redirect back to saved rides
            router.push('/saved-rides');
            // TODO - decide if we want to add a message to confirm to user delete was successful

        } catch (err) {
            console.log('failed to delete ride:', err);
        }
    }


    return (
        <div className='container'>
            <button className='btn-secondary' onClick={() => router.push('/saved-rides')}>Back to Saved Rides</button>
            <h1>Saved Ride</h1>

            {isLoading === true ? (
                // <p>Loading...</p>
                <Spinner></Spinner>
            ) : (!savedRide ? (
                <p>No saved ride found</p>
            ) : (
                <SavedRideDetail
                    savedRide={savedRide}
                    handleDelete={handleDelete}
                    >
                </SavedRideDetail>
            )

            )}

        </div>
    )
};

