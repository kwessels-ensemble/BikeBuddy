"use client";

import { useEffect, useState } from "react";
// import axios from "axios";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { DateTime } from "luxon";


// export const metadata = {
//   title: "Scheduled Ride Details",
//   description: "View a scheduled ride."
// };

export default function ScheduledRideDetail( { scheduledRide, handleCancel, handleEdit, handleJoin, handleLeave }) {

    const router = useRouter();

    // check if event was in past for cancel/edit button disabling
    const eventTimeUTC = DateTime.fromISO(scheduledRide.eventTime, {zone: 'utc'});
    const currentTimeUTC = DateTime.utc();
    const isPastRide = eventTimeUTC < currentTimeUTC;


    return (
        <ul> {scheduledRide.rideDetails.title}
            <li>Description: {scheduledRide.rideDetails.description}</li>
            <li>Link: <Link
                        href={scheduledRide.rideDetails.link} target="_blank" rel="noopener norefferrer">
                        {scheduledRide.rideDetails.link}
                        </Link>
            </li>
            <li>Type: {scheduledRide.rideDetails.type}</li>
            <li>Notes: {scheduledRide.rideDetails.notes}</li>
            <li>Location: {`${scheduledRide.rideDetails.location.city}, ${scheduledRide.rideDetails.location.state}`}</li>
            <li>Organizer: {scheduledRide.organizer.username}</li>
            <li>Visibility: {scheduledRide.isPublic ? 'Public' : 'Private'}</li>
            <li>Participants: {scheduledRide.participants.length ?
                scheduledRide.participants.map((user) => user.username).join(', ')
                : 'No participants yet.'}</li>
            <li>Time: {DateTime.fromISO(scheduledRide.eventTime, {zone: 'utc'})
                                                            .setZone(scheduledRide.timeZone)
                                                            .toFormat('ff')} </li>

            {/* <button
                disabled={isPastRide}
                onClick={() => router.push(`/scheduled-rides/${scheduledRide._id}/edit`)}>
                Edit Ride
            </button> */}

            {handleEdit && <button
                disabled={isPastRide}
                onClick={() => handleEdit(scheduledRide._id)}>
                Edit Ride
            </button>}

            {handleCancel && <button
                disabled={isPastRide}
                onClick={() => handleCancel(scheduledRide._id)}>
                Cancel Ride
            </button>}

            {handleJoin && <button onClick={() => handleJoin(scheduledRide._id)}>
                Join Ride
            </button>}

            {handleLeave && <button onClick={() => handleLeave(scheduledRide._id)}>
                Leave Ride
            </button>}

        </ul>
    )
}
