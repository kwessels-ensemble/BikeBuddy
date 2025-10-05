"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

// TODO-  rename this to "saved rides"

// export const metadata = {
//   title: "Saved Rides",
//   description: "Track and add to your saved rides."
// };

export default function SavedRides() {

    // define state
    const [savedRides, setSavedRides] = useState([]);

    async function getSavedRides () {
            try {
                const response = await axios.get('/api/saved-rides');
                console.log(response);
                setSavedRides(response.data.savedRides);

            } catch (err) {
                console.log('failed to get saved rides:', err);
            }
        }

    useEffect( () => {
        getSavedRides();
    }, []);

    // TODO - add loading logic and avoid initial display of "no saved rides found"

    // TODO - add this logic into 1 return statement for the repeated tags/link
    if (!savedRides.length) {
        return (
            <div>
                <h1>Saved Rides</h1>
                <Link href="/save-new-ride">
                    <button>Create New Ride!</button>
                </Link>
                <p> No saved rides found. </p>
            </div>
        )
    }

    // TODO - move ride display logic into a child component
    // choose which details to display for each ride
    return (
        <div>
            <h1>Saved Rides</h1>
            <Link href="/save-new-ride">
                <button>Create New Ride!</button>
            </Link>

            {savedRides.map(ride => (
                <ul key={ride._id}> {ride.title}
                    <li>Description: {ride.description}</li>
                    <li>Link: {ride.link}</li>
                    <li>Type: {ride.type}</li>
                    <li>Tags: {ride.tags}</li>
                    <li>Notes: {ride.notes}</li>
                    <li>Location: {ride.locaiton}</li>
                </ul>
            ))}

        </div>
    )
};

