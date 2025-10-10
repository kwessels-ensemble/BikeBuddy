"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";


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
            // reload
            // setSavedRides((prev) =>
            //     prev.filter((ride) =>ride._id !== rideId));
            // redirect back to saved rides
            router.push('/saved-rides');
            // TODO - decide if we want to add a message to confirm to user delete was successful

        } catch (err) {
            console.log('failed to delete ride:', err);
        }
    }

    // TODO - move ride display logic into a child component
    // choose which details to display for each ride
    return (
        <div>
            <h1>Saved Ride</h1>

            {isLoading === true ? (
                <p>Loading...</p>
            ) : (!savedRide ? (
                <p>No saved ride found</p>
            ) :
                <ul key={savedRide._id}> {savedRide.title}
                    <li>Description: {savedRide.description}</li>
                    <li>Link: {savedRide.link}</li>
                    <li>Type: {savedRide.type}</li>
                    <li>Notes: {savedRide.notes}</li>
                    <li>Location: {`${savedRide.location.city}, ${savedRide.location.state}`}</li>

                    <button onClick={() => router.push(`/saved-rides/${savedRide._id}/edit`)}>
                        Edit
                    </button>
                    <button onClick={() => handleDelete(savedRide._id)}>
                        Delete
                    </button>
                    <button onClick={() => router.push(`/scheduled-rides/new?savedRideId=${savedRide._id}`)}>
                        Schedule this Ride
                    </button>

                </ul>
            )}

        </div>
    )
};

