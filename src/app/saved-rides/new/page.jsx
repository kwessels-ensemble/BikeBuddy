"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import SavedRideForm from "@/components/Rides/SavedRide/SavedRideForm";

// export const metadata = {
//   title: "Create New Ride",
//   description: "Create and save a new ride."
// };



// create new ride

export default function SaveNewRide() {


    const router = useRouter();

    // store ride in state
    const defaultRide = {
        title: "",
        description: "",
        link: "",
        type: "",
        notes: "",
        location: {city: "", state: ""}
    };

    const [ride, setRide] = useState(defaultRide);

    const submitButtonText='Create';



    const handleCreate = async () => {

        try {
            // e.preventDefault();

            console.log(ride);

            const response = await axios.post('/api/saved-rides', ride);
            console.log(response);

            // reset ride
            setRide(defaultRide);

            // redirect to '/saved-rides'
            router.push('/saved-rides');

        } catch (err) {
            console.log('failed to save ride:', err);
        }

    }


    return (
        <div>
            <button onClick={() => router.push('/saved-rides')}>Back to Saved Rides</button>

            <h1>Create New Ride</h1>

            <SavedRideForm
                ride={ride}
                setRide={setRide}
                onSubmit={handleCreate}
                submitButtonText={submitButtonText}
                >
            </SavedRideForm>

        </div>
    )
}

