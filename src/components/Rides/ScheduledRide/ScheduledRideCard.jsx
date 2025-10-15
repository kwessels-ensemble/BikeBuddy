"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DateTime } from "luxon";
// import styles from './page.module.css';


export default function ScheduledRideCard({ authUser, ride, handleCancel, handleEdit, rideDetailPath, handleJoin, handleLeave }) {

    const router = useRouter();

    // check if event was in past for cancel/edit button disabling
    const eventTimeUTC = DateTime.fromISO(ride.eventTime, {zone: 'utc'});
    const currentTimeUTC = DateTime.utc();

    const isPastRide = eventTimeUTC < currentTimeUTC;

    // check if auth user is organizer and /or participant
    const isOrganizer = authUser?._id === ride.organizer?._id;
    const isParticipant = ride.participants?.some((p) => p._id === authUser?._id);


    function formatParticipants(participants) {
        // handle edge case, though we always expect at least 1 participant
        if (!participants.length) {
            return 'No participants yet.';
        }

        const totalParticipants = participants.length;
        // grab (up to) the first 3 to display
        const firstThree = participants.slice(0, 3);
        let outputText = firstThree.map((user) => user.username).join(', ');
        if (totalParticipants <= 3) {
            return outputText;
        }
        const extraParticipants = totalParticipants - 3;
        return (outputText + ` + ${extraParticipants} more.`)
    }


    return (
        <div className='card'>
            <div className='card-header'>
                <h3 className='rideTitle'>
                    <Link href={`${rideDetailPath}/${ride._id}`} className='rideTitleLink'>
                        {ride.rideDetails.title}
                    </Link>
                </h3>
                <p className={`visibility-tag ${ride.isPublic ? 'public' : 'private'}`}>{ride.isPublic ? '🌎 Public' : '🔒 Private'}</p>
            </div>

            <div className='card-body'>
                <div className='ride-info'>
                    <div>
                        <p>{ride.rideDetails.type === 'road' && '🚴 Road'}</p>
                        <p>{ride.rideDetails.type === 'gravel' && '🚴 🚵 Gravel'}</p>
                        <p>{ride.rideDetails.type === 'mtb' && '🚵 Mountain'}</p>
                    </div>
                    <p> • </p>
                    <p>📍 {`${ride.rideDetails.location.city}, ${ride.rideDetails.location.state}`}</p>

                    { ride.rideDetails.link  &&
                    <p className='link-container'>
                        <span> • </span>
                        <Link
                            href={ride.rideDetails.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={ride.rideDetails.link} //tooltip shows full url
                            className='link'
                            >
                            🔗 View Link

                        </Link>
                    </p>
                    }
                </div>

            </div>
            <div className='card-footer'>
                <div className='card-createdAt'>
                    <div className="ride-info">
                        <p>🧍{ride.organizer.username}</p>
                        <p> • </p>
                        <p> 🕓 {DateTime.fromISO(ride.eventTime, {zone: 'utc'})
                                                .setZone(ride.timeZone)
                                                // .toFormat('ff')
                                                .toFormat('ccc, LLL d • h:mm a')
                                                } </p>
                    </div>

                    <p>Participants: {formatParticipants(ride.participants)}</p>

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

                </div>
            </div>
        </div>
    )
}