"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

// export const metadata = {
//   title: "Update ride Ride",
//   description: "Update an existing ride."
// };



export default function EditRide() {

    const { rideId } = useParams();
    const router = useRouter();
    // default is null, then populate on first load
    const [ride, setRide] = useState(null);

    // default location options fro MVP
    // TODO - also add coordinates for the default location list
    const locationOptions = [
        {city: 'San Francisco', state: 'CA'},
        {city: 'Santa Cruz', state: 'CA'},
        {city: 'Pacifica', state: 'CA'},
        {city: 'Berkeley', state: 'CA'},
        {city: 'Oakland', state: 'CA'},
        {city: 'Fairfax', state: 'CA'}
    ]

    const typeOptions = ['mtb', 'gravel', 'road'];


    async function fetchRide () {
        try {
            const response = await axios.get(`/api/saved-rides/${rideId}`);
            console.log(response);
            setRide(response.data);

        } catch (err) {
            console.log('failed to get ride:', err);
        }
        }


    useEffect( () => {
        fetchRide();
    }, [rideId]);



    const handleSubmit = async (e) => {
        // TODO - add loading logic, button disabling logic
        // add handling to catch form submit without any required fields
        try {
            e.preventDefault();

            console.log(ride);

            const response = await axios.patch(`/api/saved-rides/${rideId}`, ride);
            console.log(response);

            // reset ride
            // setRide(defaultRide);
            // setRide(null);

            // redirect
            router.push('/saved-rides');

        } catch (err) {
            console.log('failed to save ride:', err);
        }

    }

    if (!ride) {
        return (<p>Loading...</p>);
    }


    return (
        <div>
            <h1>Create New Ride</h1>
            <form onSubmit={handleSubmit} className="edit-ride-form">

                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    placeholder="title"
                    value={ride.title}
                    onChange={(e) => setRide({...ride, title: e.target.value})}
                    >
                </input>

                <label htmlFor="description">Description</label>
                <input
                    id="description"
                    type="text"
                    placeholder="description"
                    value={ride.description}
                    onChange={(e) => setRide({...ride, description: e.target.value})}
                    >
                </input>

                <label htmlFor="type">Type</label>
                <select
                    id="type"
                    value={ride.type}
                    onChange={(e) => setRide({...ride, type: e.target.value})}
                    >
                        <option value="">Select ride type</option>
                        {typeOptions.map((type) => (
                            <option key={type}
                                    value={type}>
                                    {type}
                                </option>
                        ))}
                </select>

                <label htmlFor="link">Link</label>
                <input
                    id="link"
                    type="text"
                    placeholder="link"
                    value={ride.link}
                    onChange={(e) => setRide({...ride, link: e.target.value})}
                    >
                </input>

                <label htmlFor="notes">Notes</label>
                <input
                    id="notes"
                    type="text"
                    placeholder="notes"
                    value={ride.notes}
                    onChange={(e) => setRide({...ride, notes: e.target.value})}
                    >
                </input>

                <label htmlFor="location">Location</label>
                <select
                    id="location"
                    value = {
                        (ride.location.city && ride.location.state)
                        ? `${ride.location.city}, ${ride.location.state}`
                        : ""
                    }
                    onChange={(e) => {
                        const [city, state] = e.target.value.split(',').map((str) => str.trim());
                        setRide({...ride, location: {city, state}})
                    }}
                    >
                        <option value="">Select a city</option>
                        {locationOptions.map((location) => (
                            <option key={`${location.city}-${location.state}`}
                                    value={`${location.city}, ${location.state}`}>
                                    {location.city}, {location.state}
                                </option>
                        ))}
                </select>

                <button type="submit">Save Changes</button>
            </form>
        </div>
    )
}

