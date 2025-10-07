
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { DateTime } from "luxon";


// export const metadata = {
//   title: "Ride Feed",
//   description: "View and join publicly scheduled rides in your area."
// };



export default function rideFeed() {

    const router = useRouter();

    // define state
    const [publicRides, setPublicRides] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchPublicRides () {
            try {
                const response = await axios.get('/api/public-rides');
                console.log(response);

                const rideData = response.data.publicRides;

                setPublicRides(rideData.map((ride) => (
                    {
                    ...ride,
                    eventTime: DateTime.fromISO(ride.eventTime, {zone: 'utc'})
                                                .setZone(ride.timeZone)
                                                .toFormat('ff')
                })));
            } catch (err) {
                console.log('failed to fetch public rides:', err);
            } finally {
                setIsLoading(false);
            }
        }

    useEffect( () => {
        fetchPublicRides();
    }, []);


    // TODO - move ride display logic into a child component
    // choose which details to display for each ride
    return (
        <div>
            <h1>Ride Feed</h1>

            {/* TODO - decide if we want to link here the option to schedule a (public) ride */}
            {/* <Link href="/scheduled-rides/new">
                <button>Schedule New Ride!</button>
            </Link> */}

            {isLoading === true ? (
                <p>Loading...</p>
            ) : (publicRides.length === 0 ? (
                <p>No public rides found</p>
            ) :
            (publicRides.map(ride => (
                <ul key={ride._id}> {ride.rideDetails.title}
                    <li>Description: {ride.rideDetails.description}</li>
                    <li>Link: {ride.rideDetails.link}</li>
                    <li>Type: {ride.rideDetails.type}</li>
                    <li>Tags: {ride.rideDetails.tags}</li>
                    <li>Notes: {ride.rideDetails.notes}</li>
                    <li>Location: {`${ride.rideDetails.location.city}, ${ride.rideDetails.location.state}`}</li>
                    <li>Organizer: {ride.organizer.username}</li>
                    <li>Visibility: {ride.isPublic ? 'Public' : 'Private'}</li>
                    <li>Participants: {ride.participants.length ?
                        ride.participants.map((user) => user.username).join(', ')
                        : 'No participants yet.'}</li>
                    <li>Time: {ride.eventTime}</li>


                    <button onClick={() => (console.log('clicked join ride!'))}>
                        Join Ride
                    </button>
                    <button onClick={() => (console.log('clicked leave ride!'))}>
                        Leave Ride
                    </button>
                    <button onClick={() => router.push(`/ride-feed/${ride._id}`)}>
                        View Ride Details
                    </button>

                </ul>
            )))
            )}
        </div>
    )
};

