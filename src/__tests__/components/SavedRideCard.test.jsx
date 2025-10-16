/// @vitest-environment jsdom

import { render, screen, fireEvent} from "@testing-library/react"
import '@testing-library/jest-dom';
import SavedRideCard from '@/components/Rides/SavedRide/SavedRideCard';
import {vi} from 'vitest';
import axios from 'axios';
import React from 'react';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;


const mockRouter = { push: vi.fn()};

vi.mock('next/navigation', () => ({
    useRouter: () => mockRouter
}))

vi.mock('axios');

vi.mock('@/app/context/AuthContext', () => ({
    useAuth: () => ({
        authUser: null,
        authLoading: false
    })
}))

describe('Saved Ride Card Test', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    const mockEdit = vi.fn();
    const mockDelete = vi.fn();

    const ride = {
        _id: new ObjectId().toString(),
        title: 'Fun Laps',
        type: 'Gravel',
        location: { city: 'Berkeley', state: 'CA' }
    }

    it('renders the saved ride card', () => {
        render(<SavedRideCard
            ride={ride}
            handleDelete={mockDelete}
        >
        </SavedRideCard>);

        expect(screen.getByText(/Fun Laps/i)).toBeInTheDocument();
        expect(screen.getByText(/Berkeley/i)).toBeInTheDocument();
    })

    it('renders the edit and delete buttons', () => {

        render(<SavedRideCard
            ride={ride}
            handleDelete={mockDelete}
            >
            </SavedRideCard>);

        expect(screen.getByRole('button', { name: /Edit/i})).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /Delete/i})).toBeInTheDocument();
    })

    it('it calls edit when edit button is clicked', () => {

        render(<SavedRideCard
            ride={ride}
            handleDelete={mockDelete}
            >
            </SavedRideCard>);

        fireEvent.click(screen.getByRole('button', {name: /edit/i}));

        expect(mockRouter.push).toHaveBeenCalledWith(`/saved-rides/${ride._id}/edit`);



    })

    it('it calls delete when delete button is clicked', () => {

        render(<SavedRideCard
            ride={ride}
            handleDelete={mockDelete}
            >
            </SavedRideCard>);


        fireEvent.click(screen.getByRole('button', {name: /delete/i}));

        expect(mockDelete).toHaveBeenCalled();

    })

})