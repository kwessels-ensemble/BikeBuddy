"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { DateTime } from "luxon";
import ScheduledRideForm from "@/components/Rides/ScheduledRide/ScheduledRideForm";

// export const metadata = {
//   title: "Schedule New Ride",
//   description: "Schedule a ride and make public for others to join."
// };



export default function ScheduleNewRide() {


    const searchParams = useSearchParams();
    const savedRideId = searchParams.get('savedRideId');
    const router = useRouter();

    // store ride in state
    const defaultRide = {
        isPublic: "",
        eventTime: "",
        timeZone: "",
        rideDetails: {
            title: "",
            description: "",
            link: "",
            type: "",
            notes: "",
            location: {city: "", state: ""}
        }

    };

    const [ride, setRide] = useState(defaultRide);
    const [isLoading, setIsLoading] = useState(false);

    const submitButtonText = 'Create';


    useEffect(() => {
        if (savedRideId) {
            const fetchRide = async () => {
                try {
                    setIsLoading(true);
                    const response = await axios.get(`/api/saved-rides/${savedRideId}`);
                    console.log(response);
                    const data = response.data;
                    setRide((prev) => ({
                        ...prev,
                        rideDetails: {
                            ...prev.rideDetails,
                            title: data.title ?? prev.rideDetails.title,
                            description: data.description ?? prev.rideDetails.description,
                            link: data.link ?? prev.rideDetails.link,
                            type: data.type ?? prev.rideDetails.type,
                            notes: data.notes ?? prev.rideDetails.notes,
                            location: {...prev.rideDetails.location, ...(data.location || {})}
                        }
                    }));
                } catch (err) {
                    console.error('error fetching ride:', err);
                } finally {
                    setIsLoading(false);
                }

            };
            fetchRide();
        }
    }, [savedRideId]);


    const handleCreate = async () => {

        try {
            // e.preventDefault();

            console.log(ride);

            // timezone conversions
            const localDateTime = DateTime.fromISO(ride.eventTime, {zone: ride.timeZone});
            const eventTimeUtc = localDateTime.toUTC().toISO();

            const response = await axios.post('/api/scheduled-rides', {...ride, eventTime: eventTimeUtc});
            console.log(response);

            // reset ride
            setRide(defaultRide);

            // redirect to '/scheduled-rides'
            router.push('/scheduled-rides');

        } catch (err) {
            console.log('failed to schedule ride:', err);
        }

    }


    return (
        <div>
            <button className='btn-secondary' onClick={() => router.push('/scheduled-rides')}>Back to Scheduled Rides</button>

            <h1>Schedule New Ride</h1>

            {isLoading === true ? (
                <p>Loading...</p>
            ) :  (
                <ScheduledRideForm
                ride={ride}
                setRide={setRide}
                onSubmit={handleCreate}
                submitButtonText={submitButtonText}
                >
                </ScheduledRideForm>
            )
            }
        </div>
    )
}

