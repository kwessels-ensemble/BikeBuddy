"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// import axios from "axios";
import { useRouter } from "next/navigation";
import { DateTime } from "luxon";
// import styles from './page.module.css';


export default function ScheduledRideCard({ ride, handleCancel, isLoading, setIsLoading }) {

    const router = useRouter();

    return (
        <div>
            <ul> {ride.rideDetails.title}
                <li>Description: {ride.rideDetails.description}</li>
                <li>Link: <Link
                        href={ride.rideDetails.link} target="_blank" rel="noopener norefferrer">
                        {ride.rideDetails.link}
                        </Link>
                </li>
                <li>Type: {ride.rideDetails.type}</li>
                <li>Notes: {ride.rideDetails.notes}</li>
                <li>Location: {`${ride.rideDetails.location.city}, ${ride.rideDetails.location.state}`}</li>
                <li>Organizer: {ride.organizer.username}</li>
                <li>Visibility: {ride.isPublic ? 'Public' : 'Private'}</li>
                <li>Participants: {ride.participants.length ?
                    ride.participants.map((user) => user.username).join(', ')
                    : 'No participants yet.'}</li>
                <li>Time: {ride.eventTime}</li>


                <button onClick={() => router.push(`/scheduled-rides/${ride._id}/edit`)}>
                    Edit Ride
                </button>
                <button onClick={() => handleCancel(ride._id)}>
                    Cancel Ride
                </button>
                <button onClick={() => router.push(`/scheduled-rides/${ride._id}`)}>
                    View Ride Details
                </button>

            </ul>

        </div>


    )
}