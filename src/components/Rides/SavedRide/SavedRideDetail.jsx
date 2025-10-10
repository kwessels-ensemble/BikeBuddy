"use client";

// import { useEffect, useState } from "react";
import Link from "next/link";
// import axios from "axios";
import { useRouter, useParams } from "next/navigation";



export default function SavedRideDetail( { savedRide, handleDelete }) {

    const router = useRouter();

    return (
        <ul key={savedRide._id}> {savedRide.title}
            <li>Description: {savedRide.description}</li>
            <li>Link: {savedRide.link}</li>
            <li>Type: {savedRide.type}</li>
            <li>Notes: {savedRide.notes}</li>
            <li>Location: {`${savedRide.location.city}, ${savedRide.location.state}`}</li>

            <button onClick={() => router.push(`/saved-rides/${savedRide._id}/edit`)}>
                Edit
            </button>
            <button onClick={() => handleDelete(savedRide._id)}>
                Delete
            </button>
            <button onClick={() => router.push(`/scheduled-rides/new?savedRideId=${savedRide._id}`)}>
                Schedule this Ride
            </button>`
        </ul>
    )

}