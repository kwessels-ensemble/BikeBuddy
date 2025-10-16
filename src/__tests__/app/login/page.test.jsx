/// @vitest-environment jsdom

import { render, screen, fireEvent} from "@testing-library/react"
import '@testing-library/jest-dom';
import Login from '@/app/login/page';
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

describe('Log in Page Test', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });


    it('renders the login form', () => {
        render(<Login></Login>);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /Log In/i })).toBeInTheDocument();
    })

    it('submits the form and axios.post with inputs', () => {
        axios.post.mockResolvedValue({
            data: {token: 'fake-token'}
        })

        render(<Login></Login>);
        fireEvent.change(screen.getByLabelText(/email/i),
                        {target: {value: 'testuser@gmail.com' }});
        fireEvent.change(screen.getByLabelText(/password/i),
                        {target: {value: 'password123' }});
        fireEvent.click(screen.getByRole('button', {name: /Log In/i}));

        expect(axios.post).toHaveBeenCalledWith('/api/auth/login', {
            email: 'testuser@gmail.com',
            password: 'password123'
        })
    })

})