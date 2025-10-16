/// @vitest-environment jsdom

import { render, screen, fireEvent} from "@testing-library/react"
import '@testing-library/jest-dom';
import SignUp from '@/app/signup/page';
import {vi} from 'vitest';
import axios from 'axios';
import React from 'react';

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
    })
}))

vi.mock('axios');

vi.mock('@/app/context/AuthContext', () => ({
    useAuth: () => ({
        authUser: null,
        authLoading: false
    })
}))

describe('Sign Up Page Test', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });


    it('renders the signup form', () => {
        render(<SignUp></SignUp>);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /Sign Up/i })).toBeInTheDocument();
    })

    it('submits the form and mock axios.post', () => {

        axios.post.mockResolvedValue({
            data: {token: 'fake-token'}
        })

        render(<SignUp></SignUp>);
        fireEvent.change(screen.getByLabelText(/email/i),
                        {target: {value: 'testuser@gmail.com' }});
        fireEvent.change(screen.getByLabelText(/username/i),
                        {target: {value: 'testuser' }});
        fireEvent.change(screen.getByLabelText(/password/i),
                        {target: {value: 'password123' }});
        fireEvent.click(screen.getByRole('button', {name: /Sign Up/i}));

        expect(axios.post).toHaveBeenCalledWith('/api/auth/signup', {
            email: 'testuser@gmail.com',
            username: 'testuser',
            password: 'password123'
        })
    })

})