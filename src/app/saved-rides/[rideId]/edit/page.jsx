"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import SavedRideForm from "@/components/Rides/SavedRide/SavedRideForm";

// export const metadata = {
//   title: "Update ride Ride",
//   description: "Update an existing ride."
// };



export default function EditRide() {

    const { rideId } = useParams();
    const router = useRouter();

    // default is null, then populate on first load
    const [ride, setRide] = useState(null);

    const submitButtonText='Save Changes';


    async function fetchRide () {
        try {
            const response = await axios.get(`/api/saved-rides/${rideId}`);
            console.log(response);
            setRide(response.data);

        } catch (err) {
            console.log('failed to get ride:', err);
        }
        }


    useEffect( () => {
        fetchRide();
    }, [rideId]);



    const handleUpdate = async (e) => {
        // TODO - add loading logic, button disabling logic
        // add handling to catch form submit without any required fields
        try {
            e.preventDefault();

            console.log(ride);

            const response = await axios.patch(`/api/saved-rides/${rideId}`, ride);
            console.log(response);

            // reset ride
            // setRide(defaultRide);
            // setRide(null);

            // redirect
            router.push('/saved-rides');

        } catch (err) {
            console.log('failed to save ride:', err);
        }

    }

    if (!ride) {
        return (<p>Loading...</p>);
    }


    return (
        <div>
            <button onClick={() => router.push('/saved-rides')}>Back to Saved Rides</button>
            <h1>Update Ride</h1>

            <SavedRideForm
                ride={ride}
                setRide={setRide}
                onSubmit={handleUpdate}
                submitButtonText={submitButtonText}
                >
            </SavedRideForm>

        </div>
    )
}

