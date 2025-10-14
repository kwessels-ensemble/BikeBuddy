"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// import axios from "axios";
import { useRouter } from "next/navigation";
import { DateTime } from "luxon";
// import styles from './page.module.css';


export default function ScheduledRideCard({ authUser, ride, handleCancel, handleEdit, handleRideDetails, isLoading, setIsLoading, handleJoin, handleLeave }) {

    const router = useRouter();

    // check if event was in past for cancel/edit button disabling
    const eventTimeUTC = DateTime.fromISO(ride.eventTime, {zone: 'utc'});
    const currentTimeUTC = DateTime.utc();

    const isPastRide = eventTimeUTC < currentTimeUTC;

    // check if auth user is organizer and /or participant
    const isOrganizer = authUser?._id === ride.organizer?._id;
    const isParticipant = ride.participants?.some((p) => p._id === authUser?._id);

    return (
        <div className='card'>
            <div className='card-header'>
                <h3 className='rideTitle'>
                    <Link href={`/scheduled-rides/${ride._id}`} className='rideTitleLink'>
                        {ride.rideDetails.title}
                    </Link>
                </h3>
            </div>

            <div className='card-body'>
                {/* <li>Type: {ride.rideDetails.type}</li> */}

                 <div className='ride-tag'>
                    {ride.rideDetails.type === 'road' && '🚴 Road'}
                    {ride.rideDetails.type === 'gravel' && '🚴 🚵 Gravel'}
                    {ride.rideDetails.type === 'mtb' && '🚵 Mountain'}
                </div>

                {/* <p>Location: {`${ride.rideDetails.location.city}, ${ride.rideDetails.location.state}`}</p> */}
                <p>📍 {`${ride.rideDetails.location.city}, ${ride.rideDetails.location.state}`}</p>

                { ride.rideDetails.link  &&
                <p> 🔗 <Link
                        href={ride.rideDetails.link} target="_blank" rel="noopener norefferrer">
                        {ride.rideDetails.link}
                        </Link>
                </p>
                }

                {/* {ride.rideDetails.description && <p>Description: {ride.rideDetails.description}</p>}

                {ride.rideDetails.notes && <p>🗒️  {ride.rideDetails.notes}</p>} */}

                <p>Organizer: {ride.organizer.username}</p>
                <p>Visibility: {ride.isPublic ? 'Public' : 'Private'}</p>
                <p>Participants: {ride.participants.length ?
                    ride.participants.map((user) => user.username).join(', ')
                    : 'No participants yet.'}</p>
                <p>Time: {DateTime.fromISO(ride.eventTime, {zone: 'utc'})
                                                .setZone(ride.timeZone)
                                                .toFormat('ff')} </p>

            </div>
            <div className='card-footer'>
                <div className='card-createdAt'>
                    Created: {DateTime.fromISO(ride.createdAt, {zone: 'utc'})
                                                .setZone(ride.timeZone)
                                                .toFormat('ff')}
                </div>
                <div className='card-actions'>
                    {handleEdit && <button className='btn-secondary'
                        disabled={isPastRide}
                        onClick={() => handleEdit(ride._id)}>
                        Edit Ride
                    </button>}

                    {handleCancel && <button className='btn-secondary'
                        disabled={isPastRide}
                        onClick={() => handleCancel(ride._id)}>
                        Cancel Ride
                    </button>}

                    {handleJoin && <button className='btn-secondary'
                        disabled={isPastRide || isParticipant || isOrganizer}
                        onClick={() => handleJoin(ride._id)}>
                        Join Ride
                    </button>}

                    {handleLeave && <button className='btn-secondary'
                        disabled={isPastRide || !isParticipant || isOrganizer}
                        onClick={() => handleLeave(ride._id)}>
                        Leave Ride
                    </button>}

                    {/* {handleRideDetails && <button
                        onClick={() => handleRideDetails(ride._id)}>
                        View Ride Details
                    </button>} */}

                </div>
            </div>
        </div>
    )
}