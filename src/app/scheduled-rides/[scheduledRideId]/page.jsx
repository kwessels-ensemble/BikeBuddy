
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { DateTime } from "luxon";


// export const metadata = {
//   title: "Scheduled Ride Details",
//   description: "View a scheduled ride."
// };

export default function ScheduledRide() {

    const router = useRouter();
    const { scheduledRideId } = useParams();

    // define state
    const [scheduledRide, setScheduledRide] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchScheduledRide () {

        try {
            const response = await axios.get(`/api/scheduled-rides/${scheduledRideId}`);
            console.log(response);

            const rideData = response.data;

            setScheduledRide({...rideData,
                            eventTime: DateTime.fromISO(rideData.eventTime, {zone: 'utc'})
                                            .setZone(rideData.timeZone)
                                            .toFormat('ff')
                            })
        } catch (err) {
            console.log('failed to fetch scheduled ride:', err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect( () => {
        fetchScheduledRide();
    }, []);

    async function handleCancel(scheduledRideId) {
        try {
            const confirmed = window.confirm('Are you sure you want to cancel this ride?');
            if (!confirmed) {
                return;
            }
            const response = await axios.delete(`/api/scheduled-rides/${scheduledRideId}`);
            console.log(response);
            // reload
            // setScheduledRide((prev) =>
            //     prev.filter((ride) =>ride._id !== scheduledRideId));
            // redirect back to scheduled rides
            router.push('/scheduled-rides');
            // TODO - consider adding a message to inform user deletion was successfuly

        } catch (err) {
            console.log('failed to cancel ride:', err);
        }
    }

    // TODO - move ride display logic into a child component
    // choose which details to display for each ride
    return (
        <div>
            <button onClick={() => router.push('/scheduled-rides')}>Back to Scheduled Rides</button>
            <h1>Scheduled Ride</h1>

            {isLoading === true ? (
                <p>Loading...</p>
            ) : (!scheduledRide ? (
                <p>No scheduled ride found</p>
            ) :
                <ul key={scheduledRide._id}> {scheduledRide.rideDetails.title}
                    <li>Description: {scheduledRide.rideDetails.description}</li>
                    <li>Link: {scheduledRide.rideDetails.link}</li>
                    <li>Type: {scheduledRide.rideDetails.type}</li>
                    <li>Tags: {scheduledRide.rideDetails.tags}</li>
                    <li>Notes: {scheduledRide.rideDetails.notes}</li>
                    <li>Location: {`${scheduledRide.rideDetails.location.city}, ${scheduledRide.rideDetails.location.state}`}</li>
                    <li>Organizer: {scheduledRide.organizer.username}</li>
                    <li>Visibility: {scheduledRide.isPublic ? 'Public' : 'Private'}</li>
                    <li>Participants: {scheduledRide.participants.length ?
                        scheduledRide.participants.map((user) => user.username).join(', ')
                        : 'No participants yet.'}</li>
                    <li>Time: {scheduledRide.eventTime}</li>

                    <button onClick={() => router.push(`/scheduled-rides/${scheduledRide._id}/edit`)}>
                        Edit Ride
                    </button>
                    <button onClick={() => handleCancel(scheduledRide._id)}>
                        Cancel Ride
                    </button>

                </ul>
            )}

        </div>
    )
};

