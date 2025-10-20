
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { DateTime } from "luxon";
import styles from './page.module.css';
import ScheduledRideCard from "@/components/Rides/ScheduledRide/ScheduledRideCard";
import { useAuth } from "@/app/context/AuthContext";
import Spinner from "@/components/Spinner/Spinner";

// export const metadata = {
//   title: "Ride Feed",
//   description: "View and join publicly scheduled rides in your area."
// };


export default function rideFeed() {

    const router = useRouter();

    // get auth user
    const { authUser, authLoading } = useAuth();
    // define state
    const [publicRides, setPublicRides] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('upcoming'); // 'upcoming' or 'past'
    const [typeFilter, setTypeFilter] = useState('all'); // 'mtb, 'gravel', 'road', 'all'


    const rideDetailPath = '/ride-feed';

    async function fetchPublicRides () {
            try {
                const response = await axios.get('/api/public-rides', {
                    params: {
                        time: timeFilter,
                        type: typeFilter
                    }
                });

                // console.log(response);

                const rideData = response.data.publicRides;
                setPublicRides(rideData);
            } catch (err) {
                console.log('failed to fetch public rides:', err);
            } finally {
                setIsLoading(false);
            }
        }

    useEffect( () => {
        fetchPublicRides();
    }, [timeFilter, typeFilter]);


    const handleJoin = async (rideId) => {
        try {
            setIsLoading(true);
            // console.log('clicked join!');
            const response = await axios.post(`/api/scheduled-rides/${rideId}/join`);
            // console.log(response);
            const updatedRide = response.data;
            // update data on page
            setPublicRides(prev =>
                prev.map(ride => ride._id.toString() === rideId.toString()
                ?
                {...updatedRide}
                : ride)
            )
        } catch (err) {
            console.log('failed to join ride:', err);
        } finally {
            setIsLoading(false);
        }
    }

    const handleLeave = async (rideId) => {
        try {
            setIsLoading(true);
            // console.log('clicked leave!');
            const response = await axios.delete(`/api/scheduled-rides/${rideId}/leave`);
            // console.log(response);
            const updatedRide = response.data;
            // update data on page
            setPublicRides(prev =>
                prev.map(ride => ride._id.toString() === rideId.toString()
                ?
                {...updatedRide}
                : ride)
            )

        } catch (err) {
            console.log('failed to leave ride:', err);
        } finally {
            setIsLoading(false);
        }
    }




    if (authLoading) {
        // return null;
        return (
            <div className='loading-container'>
                <Spinner></Spinner>
            </div>
        )
    }

    return (
        <div className='container'>
            <Link href="/scheduled-rides/new">
                <button className='btn-primary'> + Schedule New Ride!</button>
            </Link>

            <h1>Public Ride Feed</h1>


            <div>
                {['mtb', 'gravel', 'road', 'all'].map(type => (
                    <button
                        key={type}
                        onClick={() => setTypeFilter(type)}
                        className={`btn-filter ${typeFilter === type ? 'active' : ''}`}
                    >
                        {type === 'road' && '🚴 Road'}
                        {type === 'gravel' && '🚴 🚵 Gravel'}
                        {type === 'mtb' && '🚵 Mountain'}
                        {type === 'all' && '🚲 All'}
                    </button>
                ))}
            </div>

            <div>
                {['upcoming', 'past'].map(time => (
                    <button
                        key={time}
                        onClick={() => setTimeFilter(time)}
                        className={`btn-filter ${timeFilter === time ? 'active' : ''}`}
                    >
                        {time}
                    </button>
                ))}
            </div>

            {isLoading === true ? (
                <Spinner></Spinner>
            ) : (publicRides.length === 0 ? (
                <p>No public rides found</p>
            ) :
            (publicRides.map(ride => (
                <ScheduledRideCard
                    key={ride._id}
                    authUser={authUser}
                    ride={ride}
                    rideDetailPath={rideDetailPath}
                    handleJoin={handleJoin}
                    handleLeave={handleLeave}
                    >
                </ScheduledRideCard>
            )))
            )}
        </div>
    )
};

