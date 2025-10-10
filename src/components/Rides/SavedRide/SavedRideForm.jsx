"use client";

import { useState } from "react";
import styles from './SavedRideForm.module.css';

export default function SavedRideForm( { ride, setRide, onSubmit, submitButtonText }) {

    const [errors, setErrors] = useState({});

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


    const validate = () => {
        const newErrors = {};

        if (!ride.title.trim()) {
            newErrors.title = 'Title is required.'
        }

        if (!ride.description.trim()) {
            newErrors.description = 'Description is required.'
        }

        return newErrors;
    }


    const handleSubmit = (e) => {

        e.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0 ) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            onSubmit();
        }

    }


    return (
        <form className={styles.form}>
            <label htmlFor="title">Title</label>
            <input
                id="title"
                type="text"
                placeholder="title"
                value={ride.title}
                onChange={(e) => setRide({...ride, title: e.target.value})}
                className={errors.title ? styles.invalid: ''}
                >
            </input>
            {errors.title && <span className={styles.error}>{errors.title}</span>}


            <label htmlFor="description">Description</label>
            <textarea
                id="description"
                type="text"
                placeholder="description"
                value={ride.description}
                onChange={(e) => setRide({...ride, description: e.target.value})}
                className={errors.description ? styles.invalid: ''}
                >
            </textarea>
            {errors.description && <span className={styles.error}>{errors.description}</span>}

            <label htmlFor="type">Type</label>
            <select
                id="type"
                value={ride.type}
                onChange={(e) => setRide({...ride, type: e.target.value})}
                className={errors.type ? styles.invalid: ''}
                >
                    <option value="">Select ride type</option>
                    {typeOptions.map((type) => (
                        <option key={type}
                                value={type}>
                                {type}
                            </option>
                    ))}
            </select>
            {errors.type && <span className={styles.error}>{errors.type}</span>}

            <label htmlFor="link">Link</label>
            <input
                id="link"
                type="text"
                placeholder="link"
                value={ride.link}
                onChange={(e) => setRide({...ride, link: e.target.value})}
                className={errors.link ? styles.invalid: ''}
                >
            </input>
            {errors.link && <span className={styles.error}>{errors.link}</span>}

            <label htmlFor="notes">Notes</label>
            <textarea
                id="notes"
                type="text"
                placeholder="notes"
                value={ride.notes}
                onChange={(e) => setRide({...ride, notes: e.target.value})}
                className={errors.notes ? styles.invalid: ''}
                >
            </textarea>
            {errors.notes && <span className={styles.error}>{errors.notes}</span>}

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
                className={errors.location ? styles.invalid: ''}
                >
                    <option value="">Select a city</option>
                    {locationOptions.map((location) => (
                        <option key={`${location.city}-${location.state}`}
                                value={`${location.city}, ${location.state}`}>
                                {location.city}, {location.state}
                            </option>
                    ))}
            </select>
            {errors.location && <span className={styles.error}>{errors.location}</span>}

            {/* <button onClick={onSubmit}>{submitButtonText}</button> */}
            <button onClick={handleSubmit}>{submitButtonText}</button>
            </form>
    )
}