"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import SavedRideForm from "@/components/Rides/SavedRide/SavedRideForm";
import Spinner from "@/components/Spinner/Spinner";

// export const metadata = {
//   title: "Update ride Ride",
//   description: "Update an existing ride."
// };



export default function EditRide() {

    const { rideId } = useParams();
    const router = useRouter();

    // default is null, then populate on first load
    const [ride, setRide] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const submitButtonText='Save Changes';


    async function fetchRide () {
        try {
            setIsLoading(true);
            const response = await axios.get(`/api/saved-rides/${rideId}`);
            console.log(response);
            setRide(response.data);

        } catch (err) {
            console.log('failed to get ride:', err);
        } finally {
            setIsLoading(false);
        }
    }


    useEffect( () => {
        fetchRide();
    }, [rideId]);



    const handleUpdate = async () => {
        try {
            // e.preventDefault();

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
        // return (<p>Loading...</p>);
        return (
                <div className='loading-container'>
                    <Spinner></Spinner>
                </div>
        )
    }


    return (
        <div className='container'>
            <button className='btn-secondary' onClick={() => router.push('/saved-rides')}>Back to Saved Rides</button>

            <h1>Update Ride</h1>

            {isLoading === true ? (
                // <p>Loading...</p>
                <Spinner></Spinner>
            ) : (
                <SavedRideForm
                ride={ride}
                setRide={setRide}
                onSubmit={handleUpdate}
                submitButtonText={submitButtonText}
                >
                </SavedRideForm>
            )
        }

        </div>
    )
}

