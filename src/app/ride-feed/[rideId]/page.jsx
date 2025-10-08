
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { DateTime } from "luxon";


// export const metadata = {
//   title: "Public Ride Details",
//   description: "View a public ride."
// };

export default function PublicRide() {

    const router = useRouter();
    const { rideId } = useParams();

    // define state
    const [publicRide, setPublicRide] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchPublicRide () {

        try {
            const response = await axios.get(`/api/public-rides/${rideId}`);
            console.log(response);

            const rideData = response.data;

            setPublicRide({...rideData,
                            eventTime: DateTime.fromISO(rideData.eventTime, {zone: 'utc'})
                                            .setZone(rideData.timeZone)
                                            .toFormat('ff')
                            })
        } catch (err) {
            console.log('failed to fetch public ride:', err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect( () => {
        fetchPublicRide();
    }, []);


    const handleJoinRide = async (rideId) => {
        try {
            setIsLoading(true);
            console.log('clicked join!');
            const response = await axios.post(`/api/scheduled-rides/${rideId}/join`);
            console.log(response);
            const updatedRide = response.data;
            // update data on page
            setPublicRide(prev => prev._id.toString() === rideId.toString()
                            ? {...updatedRide,
                                eventTime: DateTime.fromISO(updatedRide.eventTime, {zone: 'utc'})
                                                    .setZone(updatedRide.timeZone)
                                                    .toFormat('ff')}
                            : prev)

        } catch (err) {
            console.log('failed to join ride:', err);
        } finally {
            setIsLoading(false);
        }
    }

    const handleLeaveRide = async (rideId) => {
        try {
            setIsLoading(true);
            console.log('clicked leave!');
            const response = await axios.delete(`/api/scheduled-rides/${rideId}/leave`);
            console.log(response);
            const updatedRide = response.data;
            // update data on page
            setPublicRide(prev => prev._id.toString() === rideId.toString()
                            ? {...updatedRide,
                                eventTime: DateTime.fromISO(updatedRide.eventTime, {zone: 'utc'})
                                                    .setZone(updatedRide.timeZone)
                                                    .toFormat('ff')}
                            : prev)

        } catch (err) {
            console.log('failed to leave ride:', err);
        } finally {
            setIsLoading(false);
        }
    }

    // TODO - move ride display logic into a child component
    // choose which details to display for each ride
    return (
        <div>
            <button onClick={() => router.push('/ride-feed')}>Back to Ride Feed</button>
            <h1>Ride Details</h1>

            {isLoading === true ? (
                <p>Loading...</p>
            ) : (!publicRide ? (
                <p>No public ride found</p>
            ) :
                <ul key={publicRide._id}> {publicRide.rideDetails.title}
                    <li>Description: {publicRide.rideDetails.description}</li>
                    <li>Link: {publicRide.rideDetails.link}</li>
                    <li>Type: {publicRide.rideDetails.type}</li>
                    <li>Tags: {publicRide.rideDetails.tags}</li>
                    <li>Notes: {publicRide.rideDetails.notes}</li>
                    <li>Location: {`${publicRide.rideDetails.location.city}, ${publicRide.rideDetails.location.state}`}</li>
                    <li>Organizer: {publicRide.organizer.username}</li>
                    <li>Visibility: {publicRide.isPublic ? 'Public' : 'Private'}</li>
                    <li>Participants: {publicRide.participants.length ?
                        publicRide.participants.map((user) => user.username).join(', ')
                        : 'No participants yet.'}</li>
                    <li>Time: {publicRide.eventTime}</li>

                    <button onClick={() => handleJoinRide(publicRide._id)}>
                        Join Ride
                    </button>
                    <button onClick={() => handleLeaveRide(publicRide._id)}>
                        Leave Ride
                    </button>

                </ul>
            )}

        </div>
    )
};

