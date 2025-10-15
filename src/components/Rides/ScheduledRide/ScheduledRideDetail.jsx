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

export default function ScheduledRideDetail( { authUser, scheduledRide, handleCancel, handleEdit, handleJoin, handleLeave }) {

    const router = useRouter();

    // check if event was in past for cancel/edit/join/leave button disabling
    const eventTimeUTC = DateTime.fromISO(scheduledRide.eventTime, {zone: 'utc'});
    const currentTimeUTC = DateTime.utc();

    const isPastRide = eventTimeUTC < currentTimeUTC;

    // check if auth user is organizer and /or participant
    const isOrganizer = authUser?._id === scheduledRide.organizer?._id;
    const isParticipant = scheduledRide.participants?.some((p) => p._id === authUser?._id);

    return (
        <div className='card'>
            <div className='card-header'>
                <h3>{scheduledRide.rideDetails.title}</h3>
                <p className={`visibility-tag ${scheduledRide.isPublic ? 'public' : 'private'}`}>{scheduledRide.isPublic ? '🌎 Public' : '🔒 Private'}</p>
            </div>

            <div className='card-body'>
                <div className='ride-info'>
                    <div>
                        <p>{scheduledRide.rideDetails.type === 'road' && '🚴 Road'}</p>
                        <p>{scheduledRide.rideDetails.type === 'gravel' && '🚴 🚵 Gravel'}</p>
                        <p>{scheduledRide.rideDetails.type === 'mtb' && '🚵 Mountain'}</p>
                    </div>
                    <p> • </p>
                    <p>📍 {`${scheduledRide.rideDetails.location.city}, ${scheduledRide.rideDetails.location.state}`}</p>

                    {scheduledRide.rideDetails.link  &&
                    <>
                        <p> • </p>
                        <p> 🔗 <Link
                                href={scheduledRide.rideDetails.link} target="_blank" rel="noopener norefferrer">
                                {scheduledRide.rideDetails.link}
                                </Link>
                        </p>
                    </>
                    }
                </div>

                {scheduledRide.rideDetails.description && <p>{scheduledRide.rideDetails.description}</p>}
                {scheduledRide.rideDetails.notes && <p> 🗒️ {scheduledRide.rideDetails.notes}</p>}

            </div>

            <div className='card-footer'>
                <div className='card-createdAt'>
                    <div className="ride-info">
                        <p>🧍{scheduledRide.organizer.username}</p>
                        <p> • </p>
                        <p> 🕓 {DateTime.fromISO(scheduledRide.eventTime, {zone: 'utc'})
                                                .setZone(scheduledRide.timeZone)
                                            // .toFormat('ff')
                                            .toFormat('ccc, LLL d • h:mm a')
                                            }
                                            </p>
                    </div>
                    <p>Participants: {scheduledRide.participants.length ?
                    scheduledRide.participants.map((user) => user.username).join(', ')
                    : 'No participants yet.'}</p>
                </div>

                <div className='card-actions'>
                    {handleEdit && <button className='btn-secondary'
                        disabled={isPastRide}
                        onClick={() => handleEdit(scheduledRide._id)}>
                        Edit Ride
                    </button>}

                    {handleCancel && <button className='btn-secondary'
                        disabled={isPastRide}
                        onClick={() => handleCancel(scheduledRide._id)}>
                        Cancel Ride
                    </button>}

                    {handleJoin && <button className='btn-secondary'
                        disabled={isPastRide || isParticipant || isOrganizer}
                        onClick={() => handleJoin(scheduledRide._id)}>
                        Join Ride
                    </button>}

                    {handleLeave && <button className='btn-secondary'
                        disabled={isPastRide || !isParticipant || isOrganizer}
                        onClick={() => handleLeave(scheduledRide._id)}>
                        Leave Ride
                    </button>}
                </div>

            </div>
        </div>
              )
}




