"use client";


import { DateTime } from "luxon";
import styles from './ScheduledRideForm.module.css';
import { useState } from "react";



export default function ScheduledRideForm( { ride, setRide, onSubmit, submitButtonText }) {

    const [errors, setErrors] = useState({});

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


    const validateLink = (link) => {
        try {
            new URL(link);
            return true;
        } catch {
            return false;
        }
    }

    // TODO - handle mapping of field name versus display value here -
    const validate = () => {
        const newErrors = {};
        // handle required fields -
        const requiredTextFields = ['organizer', 'eventTime', 'timeZone', 'isPublic'];
        for (let field of requiredTextFields) {
            if (!ride[field]) {
                // for now, handling of isPublic -
                if (field === 'isPublic') {
                    newErrors[field] = 'Visibility is required.'
                } else {
                    newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`
                }
            }
        // handling required nested rideDetails fields
        const requiredNestedFields = ['title', 'type']
        for (let field of requiredNestedFields) {
            if (!ride.rideDetails[field]) {
                newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`
            }
        }
        // handling nested location logic
        if (!ride.rideDetails.location || !(ride.rideDetails.location.city && ride.rideDetails.location.state))
            newErrors.location = 'Location (city, state) is required.';
        }
        // handling link validation
        if (ride.rideDetails.link && !validateLink(ride.rideDetails.link)) {
            newErrors.link = 'Link is invalid.';
        }
        // handling datetime validation
        // only run this logic if both eventTime and timeZone are populated
        if (ride.eventTime && ride.timeZone) {
            const selectedTimeUTC = DateTime.fromISO(ride.eventTime, {zone: 'utc'})
            const currentTimeUTC = DateTime.utc();

            if (!selectedTimeUTC.isValid) {
                newErrors.eventTime = 'EventTime is not valid.';
            }

            if (selectedTimeUTC <= currentTimeUTC) {
                newErrors.eventTime = 'Please select a future date and time.';
            }
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

            <p className={styles.note}>* Required fields</p>

            <label htmlFor="title">Title <span className={styles.required}>*</span></label>
            <input
                id="title"
                type="text"
                placeholder="title"
                value={ride.rideDetails.title}
                onChange={(e) => setRide({...ride,
                                        rideDetails: {
                                            ...ride.rideDetails,
                                                title: e.target.value}})}
                className={errors.title ? styles.invalid: ''}
                >
            </input>
            {errors.title && <span className={styles.error}>{errors.title}</span>}

            <label htmlFor="description">Description </label>
            <textarea
                id="description"
                type="text"
                placeholder="description"
                value={ride.rideDetails.description}
                onChange={(e) => setRide({...ride,
                                        rideDetails: {
                                            ...ride.rideDetails,
                                                description: e.target.value}})}
                className={errors.description ? styles.invalid: ''}
                >
            </textarea>
            {errors.description && <span className={styles.error}>{errors.description}</span>}

            <label htmlFor="type">Type <span className={styles.required}>*</span></label>
            <select
                id="type"
                value={ride.rideDetails.type}
                onChange={(e) => setRide({...ride,
                                        rideDetails: {
                                            ...ride.rideDetails,
                                                type: e.target.value}})}
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
                value={ride.rideDetails.link}
                onChange={(e) => setRide({...ride,
                                        rideDetails: {
                                            ...ride.rideDetails,
                                                link: e.target.value}})}
                className={errors.link ? styles.invalid: ''}
                >
            </input>
            {errors.link && <span className={styles.error}>{errors.link}</span>}

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
                className={errors.notes ? styles.invalid: ''}
                >
            </textarea>
            {errors.notes && <span className={styles.error}>{errors.notes}</span>}

            <label htmlFor="location">Location <span className={styles.required}>*</span></label>
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

            <label htmlFor="isPublic">Visibility <span className={styles.required}>*</span></label>
            <select
                id="isPublic"
                value={ride.isPublic}
                onChange={(e) => setRide({...ride, isPublic: e.target.value})}
                className={errors.isPublic ? styles.invalid: ''}
                >
                <option value="">Select visibility</option>
                <option value="false">Private</option>
                <option value="true">Public</option>
            </select>
            {errors.isPublic && <span className={styles.error}>{errors.isPublic}</span>}

            <label htmlFor="eventTime">Event Time <span className={styles.required}>*</span></label>
            <input
                id="eventTime"
                type="datetime-local"
                value={ride.eventTime}
                onChange={(e) => setRide({...ride, eventTime: e.target.value})}
                className={errors.eventTime ? styles.invalid: ''}
                >
            </input>
            {errors.eventTime && <span className={styles.error}>{errors.eventTime}</span>}

            <label htmlFor="timeZone">Time Zone <span className={styles.required}>*</span></label>
            <select
                id="timeZone"
                value={ride.timeZone}
                onChange={(e) => setRide({...ride, timeZone: e.target.value})}
                className={errors.timeZone ? styles.invalid: ''}
                >
                <option value="">Select a time zone</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="UTC">UTC</option>
            </select>
            {errors.timeZone && <span className={styles.error}>{errors.timeZone}</span>}

            <button onClick={handleSubmit}>{submitButtonText}</button>
        </form>

    )
}

