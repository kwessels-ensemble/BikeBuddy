"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { DateTime } from "luxon";
import ScheduledRideForm from "@/components/Rides/ScheduledRide/ScheduledRideForm";

// export const metadata = {
//   title: "Update ride Ride",
//   description: "Update an existing ride."
// };



export default function EditScheduledRide() {

    const { rideId } = useParams();
    const router = useRouter();
    // default is null, then populate on first load
    // store ride in state
    // const defaultRide = {
    //     isPublic: "",
    //     eventTime: "",
    //     timeZone: "",
    //     rideDetails: {
    //         title: "",
    //         description: "",
    //         link: "",
    //         type: "",
    //         notes: "",
    //         location: {city: "", state: ""}
    //     }

    // };
    // const [ride, setRide ] = useState(defaultRide);
    const [ride, setRide] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const submitButtonText = 'Update';


    async function fetchScheduledRide () {
        try {
            setIsLoading(true);
            const response = await axios.get(`/api/scheduled-rides/${rideId}`);
            console.log(response);
            setRide({...response.data,
                // added -
                    isPublic: Boolean(response.data.isPublic),
                    eventTime: DateTime.fromISO(response.data.eventTime, {zone: 'utc'})
                                                            .setZone(response.data.timeZone)
                                                            .toFormat("yyyy-MM-dd'T'HH:mm")
            })

        } catch (err) {
            console.log('failed to get ride:', err);
        } finally {
            setIsLoading(false);
        }
        }


    useEffect( () => {
        fetchScheduledRide();
    }, [rideId]);



    const handleUpdate = async () => {
        // TODO - add loading logic, button disabling logic
        // add handling to catch form submit without any required fields
        try {
            // e.preventDefault();

            console.log(ride);

            const response = await axios.patch(`/api/scheduled-rides/${rideId}`, ride);
            console.log(response);

            // reset ride
            // setRide(defaultRide);
            // setRide(null);

            // redirect
            router.push('/scheduled-rides');

        } catch (err) {
            console.log('failed to save ride:', err);
        }

    }

    if (!ride) {
        return (<p>Loading...</p>);
    }


    return (
        <div>
            <button onClick={() => router.push('/scheduled-rides')}>Back to Scheduled Rides</button>

            <h1>Update Scheduled Ride</h1>

            {isLoading === true ? (
                <p>Loading...</p>
            ) : (
                <ScheduledRideForm
                ride={ride}
                setRide={setRide}
                onSubmit={handleUpdate}
                submitButtonText={submitButtonText}
                >
                </ScheduledRideForm>
            )
        }

        </div>
    )
}

