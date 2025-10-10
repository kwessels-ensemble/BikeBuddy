"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";



export default function SavedRideCard({ ride, handleDelete }) {

    const router = useRouter();

    return (
        <ul> {ride.title}
            <li>Description: {ride.description}</li>
            <li>Link: {ride.link}</li>
            <li>Type: {ride.type}</li>
            <li>Notes: {ride.notes}</li>
            <li>Location: {`${ride.location.city}, ${ride.location.state}`}</li>

            <button onClick={() => router.push(`/saved-rides/${ride._id}/edit`)}>
                Edit
            </button>
            <button onClick={() => handleDelete(ride._id)}>
                Delete
            </button>
            <button onClick={() => router.push(`/scheduled-rides/new?savedRideId=${ride._id}`)}>
                Schedule this Ride
            </button>
            <button onClick={() => router.push(`/saved-rides/${ride._id}`)}>
                View Ride Details
            </button>

        </ul>
    )



        }