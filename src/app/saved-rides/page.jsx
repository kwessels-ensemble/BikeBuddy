"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from './page.module.css';
import SavedRideCard from "@/components/Rides/SavedRide/SavedRideCard";

// export const metadata = {
//   title: "Saved Rides",
//   description: "Track and add to your saved rides."
// };

export default function SavedRides() {

    const router = useRouter();

    // define state
    const [savedRides, setSavedRides] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('all'); // 'mtb, 'gravel', 'road', 'all'

    async function fetchSavedRides () {
            try {
                const response = await axios.get('/api/saved-rides', {
                    params: {
                        type: typeFilter
                    }
                });

                console.log(response);
                setSavedRides(response.data.savedRides);

            } catch (err) {
                console.log('failed to get saved rides:', err);
            } finally {
                setIsLoading(false);
            }
        }

    useEffect( () => {
        fetchSavedRides();
    }, [typeFilter]);

    async function handleDelete(rideId) {
        console.log('inside delete')
        try {
            const confirmed = window.confirm('Are you sure you want to delete this ride?');
            if (!confirmed) {
                return;
            }
            const response = await axios.delete(`/api/saved-rides/${rideId}`);
            console.log(response);
            // reload
            setSavedRides((prev) =>
                prev.filter((ride) =>ride._id !== rideId));

        } catch (err) {
            console.log('failed to delete ride:', err);
        }
    }


    return (
        <div>
            <h1>Saved Rides</h1>
            <Link href="/saved-rides/new">
                <button>Create New Ride!</button>
            </Link>

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
            ) : (savedRides.length === 0 ? (
                <p>No saved rides found</p>
            ) :
                (savedRides.map(ride => (
                    <SavedRideCard
                        key={ride._id}
                        ride={ride}
                        handleDelete={handleDelete}
                    >
                    </SavedRideCard>
                )))

            )}
        </div>
    )
};

