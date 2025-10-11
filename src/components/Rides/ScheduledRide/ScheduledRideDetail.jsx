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

export default function ScheduledRideDetail( { scheduledRide, handleCancel }) {

    const router = useRouter();

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
            <li>Time: {scheduledRide.eventTime}</li>

            <button onClick={() => router.push(`/scheduled-rides/${scheduledRide._id}/edit`)}>
                Edit Ride
            </button>
            <button onClick={() => handleCancel(scheduledRide._id)}>
                Cancel Ride
            </button>

        </ul>
    )
}
