"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DateTime } from "luxon";


export default function SavedRideCard({ ride, handleDelete }) {

    const router = useRouter();

    // MVP - local time pacific
    // V1- will add this to user table in db
    const localTime = 'America/Los_Angeles';


    return (
        <div className='card'>
            <div className='card-header'>
                <h3 className='rideTitle'>
                    <Link href={`/saved-rides/${ride._id}`} className='rideTitleLink'>
                        {ride.title}
                    </Link>
                </h3>
            </div>

            <div className='card-body'>
                {/* <p>Description: {ride.description}</p> */}
                <div className='ride-info'>
                    <div>
                        {ride.type === 'road' && '🚴 Road'}
                        {ride.type === 'gravel' && '🚴 🚵 Gravel'}
                        {ride.type === 'mtb' && '🚵 Mountain'}
                    </div>

                    {/* {ride.notes && <p> 🗒️ {ride.notes}</p>} */}
                    <p> • </p>
                    <p>📍 {`${ride.location.city}, ${ride.location.state}`}</p>

                    { ride.link  &&
                    <>
                        <p> • </p>
                        <p> 🔗 <Link
                                href={ride.link} target="_blank" rel="noopener norefferrer">
                                {ride.link}
                                </Link>
                        </p>
                    </>
                    }
                </div>

            </div>
            <div className='card-footer'>
                <div className='card-createdAt'>
                    Created: {DateTime.fromISO(ride.createdAt, {zone: 'utc'})
                                                .setZone(localTime)
                                                .toFormat('ff')}
                </div>
                <div className='card-actions'>
                    <button className='btn-secondary' onClick={() => router.push(`/saved-rides/${ride._id}/edit`)}>
                        ✏️ Edit
                    </button>
                    <button className='btn-secondary' onClick={() => handleDelete(ride._id)}>
                        🗑️ Delete
                    </button>
                    <button className='btn-primary' onClick={() => router.push(`/scheduled-rides/new?savedRideId=${ride._id}`)}>
                        📅 Schedule
                    </button>

                </div>
            </div>


        </div>

    )



        }