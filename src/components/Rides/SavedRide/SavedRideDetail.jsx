"use client";

// import { useEffect, useState } from "react";
import Link from "next/link";
// import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { DateTime } from "luxon";


export default function SavedRideDetail( { savedRide, handleDelete }) {

    const router = useRouter();

     // MVP - local time pacific
    // V1- will add this to user table in db
    const localTime = 'America/Los_Angeles';

    return (
         <div className='card'>
            <div className='card-header'>
                <h3 className='rideTitle'>{savedRide.title} </h3>
            </div>

            <div className='card-body'>
                <div className='ride-info'>
                    <div>
                        {savedRide.type === 'road' && '🚴 Road'}
                        {savedRide.type === 'gravel' && '🚴 🚵 Gravel'}
                        {savedRide.type === 'mtb' && '🚵 Mountain'}
                    </div>

                    {/* {ride.notes && <p> 🗒️ {ride.notes}</p>} */}
                    <p> • </p>
                    <p>📍 {`${savedRide.location.city}, ${savedRide.location.state}`}</p>

                    { savedRide.link  &&
                        <>
                            <p> • </p>
                            <p> 🔗 <Link
                                    href={savedRide.link} target="_blank" rel="noopener norefferrer">
                                    {savedRide.link}
                                    </Link>
                            </p>
                        </>
                    }
                </div>

                {savedRide.description && <p>{savedRide.description}</p>}
                {savedRide.notes && <p> 🗒️ {savedRide.notes}</p>}

            </div>

            <div className='card-footer'>
                <div className='card-createdAt'>
                    Created: {DateTime.fromISO(savedRide.createdAt, {zone: 'utc'})
                                                                    .setZone(localTime)
                                                                    .toFormat('ff')}
                </div>
                <div className='card-actions'>
                    <button className='btn-secondary' onClick={() => router.push(`/saved-rides/${savedRide._id}/edit`)}>
                        ✏️ Edit
                    </button>
                    <button className='btn-secondary' onClick={() => handleDelete(savedRide._id)}>
                        🗑️ Delete
                    </button>
                    <button className='btn-primary' onClick={() => router.push(`/scheduled-rides/new?savedRideId=${savedRide._id}`)}>
                        📅 Schedule
                    </button>`
                </div>
            </div>


        </div>
    )

}