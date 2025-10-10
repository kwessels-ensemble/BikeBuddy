"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

// export const metadata = {
//   title: "Update ride Ride",
//   description: "Update an existing ride."
// };



export default function EditScheduledRide() {

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


    async function fetchScheduledRide () {
        try {
            const response = await axios.get(`/api/scheduled-rides/${rideId}`);
            console.log(response);
            setRide(response.data);

        } catch (err) {
            console.log('failed to get ride:', err);
        }
        }


    useEffect( () => {
        fetchScheduledRide();
    }, [rideId]);



    const handleSubmit = async (e) => {
        // TODO - add loading logic, button disabling logic
        // add handling to catch form submit without any required fields
        try {
            e.preventDefault();

            console.log(ride);

            const response = await axios.patch(`/api/scheduled-rides/${rideId}`, ride);
            console.log(response);

            // reset ride
            // setRide(defaultRide);
            // setRide(null);

            // redirect
            router.push('/scheduled-rides');

        } catch (err) {
            console.log('failed to save ride:', err);
        }

    }

    if (!ride) {
        return (<p>Loading...</p>);
    }


    return (
        <div>
            <button onClick={() => router.push('/scheduled-rides')}>Back to Scheduled Rides</button>
            <h1>Update Scheduled Ride</h1>
            <form onSubmit={handleSubmit} className="schedule-ride-form">

                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    placeholder="title"
                    value={ride.rideDetails.title}
                    onChange={(e) => setRide({...ride,
                                            rideDetails: {
                                                ...ride.rideDetails,
                                                    title: e.target.value}})}
                    >
                </input>

                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    type="text"
                    placeholder="description"
                    value={ride.rideDetails.description}
                    onChange={(e) => setRide({...ride,
                                            rideDetails: {
                                                ...ride.rideDetails,
                                                    description: e.target.value}})}
                    >
                </textarea>

                <label htmlFor="type">Type</label>
                <select
                    id="type"
                    value={ride.rideDetails.type}
                    onChange={(e) => setRide({...ride,
                                            rideDetails: {
                                                ...ride.rideDetails,
                                                    type: e.target.value}})}
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
                    value={ride.rideDetails.link}
                    onChange={(e) => setRide({...ride,
                                            rideDetails: {
                                                ...ride.rideDetails,
                                                    link: e.target.value}})}
                    >
                </input>

                <label htmlFor="notes">Notes</label>
                <textarea
                    id="notes"
                    type="text"
                    placeholder="notes"
                    value={ride.rideDetails.notes}
                    onChange={(e) => setRide({...ride,
                                            rideDetails: {
                                                ...ride.rideDetails,
                                                    notes: e.target.value}})}
                    >
                </textarea>

                <label htmlFor="location">Location</label>
                <select
                    id="location"
                    value = {
                        (ride.rideDetails.location.city && ride.rideDetails.location.state)
                        ? `${ride.rideDetails.location.city}, ${ride.rideDetails.location.state}`
                        : ""
                    }
                    onChange={(e) => {
                        const [city, state] = e.target.value.split(',').map((str) => str.trim());
                        setRide({...ride,
                                rideDetails: {
                                    ...ride.rideDetails,
                                    location: {
                                        ...ride.rideDetails.location,
                                        city,
                                        state
                                    }
                                }
                                    })
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

                <label htmlFor="isPublic">Visibility</label>
                <select
                    id="isPublic"
                    value={ride.isPublic}
                    onChange={(e) => setRide({...ride, isPublic: e.target.value})}
                    >
                    <option value="">Select visibility</option>
                    <option value="false">Private</option>
                    <option value="true">Public</option>
                </select>

                <label htmlFor="eventTime">Event Time</label>
                <input
                    id="eventTime"
                    type="datetime-local"
                    value={ride.eventTime}
                    onChange={(e) => setRide({...ride, eventTime: e.target.value})}>
                </input>

                <label htmlFor="timeZone">Time Zone</label>
                <select
                    id="timeZone"
                    value={ride.timeZone}
                    onChange={(e) => setRide({...ride, timeZone: e.target.value})}
                >
                    <option value="">Select a time zone</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="UTC">UTC</option>
                </select>


                <button type="submit">Save Changes</button>
            </form>
        </div>
    )
}

