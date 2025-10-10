"use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";



export default function SavedRideForm( { ride, setRide, onSubmit, submitButtonText }) {

    // const router = useRouter();

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


    return (
        <form className="saved-ride-form">
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
            <textarea
                id="description"
                type="text"
                placeholder="description"
                value={ride.description}
                onChange={(e) => setRide({...ride, description: e.target.value})}
                >
            </textarea>

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
            <textarea
                id="notes"
                type="text"
                placeholder="notes"
                value={ride.notes}
                onChange={(e) => setRide({...ride, notes: e.target.value})}
                >
            </textarea>

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

            <button onClick={onSubmit}>{submitButtonText}</button>
            </form>
    )
}