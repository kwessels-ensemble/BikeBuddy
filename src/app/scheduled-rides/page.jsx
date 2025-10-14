
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { DateTime } from "luxon";
import styles from './page.module.css';
import ScheduledRideCard from "@/components/Rides/ScheduledRide/ScheduledRideCard";
import { useAuth } from "@/app/context/AuthContext";


// export const metadata = {
//   title: "Scheduled Rides",
//   description: "View your scheduled rides, both public and private."
// };

export default function ScheduledRides() {

    const router = useRouter();

    // get auth user
    const { authUser, authLoading } = useAuth();
    // define state
    const [scheduledRides, setScheduledRides] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('upcoming'); // 'upcoming' or 'past'
    const [typeFilter, setTypeFilter] = useState('all'); // 'mtb, 'gravel', 'road', 'all'

    const rideDetailPath = '/scheduled-rides';

    async function fetchScheduledRides () {
            try {
                const response = await axios.get('/api/scheduled-rides', {
                    params: {
                        time: timeFilter,
                        type: typeFilter
                    }
                });

                console.log(response);

                const rideData = response.data.scheduledRides;

                setScheduledRides(rideData);

            } catch (err) {
                    console.error('failed to get scheduled rides:', err);
            } finally {
                setIsLoading(false);
            }
        }

    useEffect( () => {
        fetchScheduledRides();
    }, [timeFilter, typeFilter]);

    async function handleCancel(scheduledRideId) {
        try {
            const confirmed = window.confirm('Are you sure you want to cancel this ride?');
            if (!confirmed) {
                return;
            }
            const response = await axios.delete(`/api/scheduled-rides/${scheduledRideId}`);
            console.log(response);
            // reload
            setScheduledRides((prev) =>
                prev.filter((ride) =>ride._id !== scheduledRideId));

        } catch (err) {
            console.log('failed to cancel ride:', err);
        }
    }

    // const handleRideDetails = (rideId) => {
    //     router.push(`/scheduled-rides/${rideId}`);
    // }

    const handleEdit = (rideId) => {
        router.push(`/scheduled-rides/${rideId}/edit`);
    }

    if (authLoading) {
        return (<p>Loading user... </p>);
    }

    return (
        <div className='container'>

            <Link href="/scheduled-rides/new">
                <button className='btn-primary'> + Schedule New Ride!</button>
            </Link>

            <h1>Scheduled Rides</h1>

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
                <p>Loading...</p>
            ) : (scheduledRides.length === 0 ? (
                <p>No scheduled rides found</p>
            ) :
                (scheduledRides.map(ride => (
                    <ScheduledRideCard
                        key={ride._id}
                        authUser={authUser}
                        ride={ride}
                        handleCancel={handleCancel}
                        handleEdit={handleEdit}
                        rideDetailPath={rideDetailPath}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        >
                    </ScheduledRideCard>
                )))

            )}
        </div>
    )
};

