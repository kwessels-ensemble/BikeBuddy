"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";


// export const metadata = {
//   title: "Saved Rides",
//   description: "Track and add to your saved rides."
// };

export default function SavedRides() {

    // define state
    const [savedRides, setSavedRides] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchSavedRides () {
            try {
                const response = await axios.get('/api/saved-rides');
                console.log(response);
                setSavedRides(response.data.savedRides);

            } catch (err) {
                console.log('failed to get saved rides:', err);
            } finally {
                setIsLoading(false);
            }
        }

    useEffect( () => {
        fetchSavedRides();
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
            setSavedRides((prev) =>
                prev.filter((ride) =>ride._id !== rideId));

        } catch (err) {
            console.log('failed to delete ride:', err);
        }
    }

    // TODO - move ride display logic into a child component
    // choose which details to display for each ride
    return (
        <div>
            <h1>Saved Rides</h1>
            <Link href="/save-new-ride">
                <button>Create New Ride!</button>
            </Link>

            {isLoading === true ? (
                <p>Loading...</p>
            ) : (savedRides.length === 0 ? (
                <p>No saved rides found</p>
            ) :
            (savedRides.map(ride => (
                <ul key={ride._id}> {ride.title}
                    <li>Description: {ride.description}</li>
                    <li>Link: {ride.link}</li>
                    <li>Type: {ride.type}</li>
                    <li>Tags: {ride.tags}</li>
                    <li>Notes: {ride.notes}</li>
                    <li>Location: {ride.locaiton}</li>
                    <button>Edit</button>
                    <button onClick={() => handleDelete(ride._id)}>Delete</button>

                </ul>
            )))
            )}
        </div>
    )
};

