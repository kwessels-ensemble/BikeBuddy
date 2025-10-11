"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// import axios from "axios";
import { useRouter } from "next/navigation";
import { DateTime } from "luxon";
// import styles from './page.module.css';


export default function ScheduledRideCard({ ride, handleCancel, handleEdit, handleRideDetails, isLoading, setIsLoading, handleJoin, handleLeave }) {

    const router = useRouter();

    // check if event was in past for cancel/edit button disabling
    const eventTimeUTC = DateTime.fromISO(ride.eventTime, {zone: 'utc'});
    const currentTimeUTC = DateTime.utc();
    const isPastRide = eventTimeUTC < currentTimeUTC;


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
                <li>Time: {DateTime.fromISO(ride.eventTime, {zone: 'utc'})
                                                .setZone(ride.timeZone)
                                                .toFormat('ff')} </li>

                {/*
                <button
                    disabled={isPastRide}
                    onClick={() => router.push(`/scheduled-rides/${ride._id}/edit`)}>
                    Edit Ride
                </button> */}

                {handleEdit && <button
                    disabled={isPastRide}
                    onClick={() => handleEdit(ride._id)}>
                    Edit Ride
                </button>}

                {handleCancel && <button
                    disabled={isPastRide}
                    onClick={() => handleCancel(ride._id)}>
                    Cancel Ride
                </button>}

                {/* <button onClick={() => router.push(`/scheduled-rides/${ride._id}`)}>
                    View Ride Details
                </button> */}


                {handleJoin && <button onClick={() => handleJoin(ride._id)}>
                    Join Ride
                </button>}

                {handleLeave && <button onClick={() => handleLeave(ride._id)}>
                    Leave Ride
                </button>}

                {handleRideDetails && <button onClick={() => handleRideDetails(ride._id)}>
                    View Ride Details
                </button>}

{/* //              <button onClick={() => router.push(`/ride-feed/${ride._id}`)}>
//                  View Ride Details
//              </button> */}

            </ul>

        </div>


    )
}