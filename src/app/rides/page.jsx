"use client";

import { useEffect, useState } from "react";
import axios from "axios";

// TODO-  rename this to "saved rides"

// export const metadata = {
//   title: "Rides",
//   description: "Track and add to your wishlist rides."
// };

export default function Rides() {

    // define state
    const [rides, setRides] = useState([]);

    // useEffect to get rides on mount-
    useEffect( () => {
        async function getRides () {
            try {
                const response = await axios.get('/api/rides');
                console.log(response);

            } catch (err) {
                console.log('failed to get rides:', err);
            }
        }
    }, []);

    if (!rides.length) {
        return <p> No saved rides found. </p>
    }

    // TODO - move ride display logic into a child component
    // add more details to each ride
    return (
        <div>
            <h1>Rides</h1>
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

