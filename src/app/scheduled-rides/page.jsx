
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { DateTime } from "luxon";
import styles from './page.module.css';
import ScheduledRideCard from "@/components/Rides/ScheduledRide/ScheduledRideCard";

// export const metadata = {
//   title: "Scheduled Rides",
//   description: "View your scheduled rides, both public and private."
// };

export default function ScheduledRides() {

    const router = useRouter();

    // define state
    const [scheduledRides, setScheduledRides] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('upcoming'); // 'upcoming' or 'past'
    const [typeFilter, setTypeFilter] = useState('all'); // 'mtb, 'gravel', 'road', 'all'

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

                setScheduledRides(rideData.map((ride) => (
                    {
                    ...ride,
                    eventTime: DateTime.fromISO(ride.eventTime, {zone: 'utc'})
                                                .setZone(ride.timeZone)
                                                .toFormat('ff')
                })));
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


    return (
        <div>
            <h1>Scheduled Rides</h1>

            <Link href="/scheduled-rides/new">
                <button>Schedule New Ride!</button>
            </Link>

            <div className={styles.timeFilters}>
                {['upcoming', 'past'].map(time => (
                    <button
                        key={time}
                        onClick={() => setTimeFilter(time)}
                        className={`${styles.filterButton} ${timeFilter === time ? styles.active : ''}`}
                    >
                        {time}
                    </button>
                ))}
            </div>

            <div className={styles.typeFilters}>
                {['mtb', 'gravel', 'road', 'all'].map(type => (
                    <button
                        key={type}
                        onClick={() => setTypeFilter(type)}
                        className={`${styles.filterButton} ${typeFilter === type ? styles.active : ''}`}
                    >
                        {type}
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
                        ride={ride}
                        handleCancel={handleCancel}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        >
                    </ScheduledRideCard>
                )))

            )}
        </div>
    )
};

