"use client";

import { useEffect, useState } from "react";
import axios from "axios";

// TODO-  rename this to "saved rides"

// export const metadata = {
//   title: "Saved Rides",
//   description: "Track and add to your saved rides."
// };

export default function SavedRides() {

    // define state
    const [rides, setRides] = useState([]);

    // useEffect to get rides on mount-
    useEffect( () => {
        async function getRides () {
            try {
                const response = await axios.get('/api/saved-rides');
                console.log(response);

            } catch (err) {
                console.log('failed to get rides:', err);
            }
        }
    }, []);

    if (!rides.length) {
        return (
            <div>
                <h1>Saved Rides</h1>
                <p> No saved rides found. </p>
            </div>
        )
    }

    // TODO - move ride display logic into a child component
    // add more details to each ride
    return (
        <div>
            <h1>Saved Rides</h1>
            <ul>
                {rides.map(ride => (
                    <li key={ride._id}>
                        {ride.title}
                        {ride.description}
                    </li>
                ))}
            </ul>
        </div>
    )
};

