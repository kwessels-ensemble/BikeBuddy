import {describe, it, expect, vi} from 'vitest';
import { createMockRequest } from '../setup';
import { Request } from 'undici';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

import { POST as signupRoute} from '@/app/api/auth/signup/route';
import { POST as loginRoute } from '@/app/api/auth/login/route';
import { GET as meRoute} from '@/app/api/auth/me/route';

describe('Auth API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('POST /api/auth/signup', () => {
        it('it returns a status 201 if signup successful', async () => {
            User.create.mockResolvedValue(({
                    _id: '123', email:
                    'test555@gmail.com' }));

            const req = createMockRequest({
                method: 'POST',
                body: {
                    email: 'testuser@gmail.com',
                    username: 'testuser123',
                    password: 'password123'
                }
            });

            const res = await signupRoute(req);
            console.log(res);
            const data = await res.json();

            expect(res.status).toBe(201);

        })

        it('it returns a status 400 if input validation errors', async () => {
            // mock value
            User.findOne.mockResolvedValueOnce({
                 _id: '123',
                 email: 'testuser123@gmail.com' });

            const req = createMockRequest({
                method: 'POST',
                body: {
                    email: 'testuser123@gmail.com',
                    username: 'testuser123',
                    password: 'password'
                }
            });

            const res = await signupRoute(req);
            const data = await res.json();

            expect(res.status).toBe(400);
            expect(data.errors).toBeDefined();

        })

    })

    describe('POST /api/auth/login', () => {
        it('it returns a status 200 if login successful', async () => {

            // mock value
            User.findOne.mockResolvedValue({
                _id: '123',
                password: 'hashedpassword'
            });

            const req = createMockRequest({
                method: 'POST',
                body: {
                    email: 'test@gmail.com',
                    password: 'password'
                },
                token: 'fake-token'
            });


            const res = await loginRoute(req);
            console.log(res);
            const data = await res.json();

            expect(res.status).toBe(200);

        })

        it('it returns a status 400 if input validation errors', async () => {
            const req = createMockRequest({
                method: 'POST',
                body: {
                    email: 'test',
                    password: 'pass'
                }

            });

             // mock the cookies
            // req.cookies = {
            //     get: vi.fn(() => ({value: fakeToken}))
            // };

            const res = await loginRoute(req);
            const data = await res.json();

            expect(res.status).toBe(400);
            expect(data.errors).toBeDefined();

        })
    })

    describe('GET /api/auth/me', () => {
        it('it returns a status 200 if request successful', async () => {
            // const fakeToken = 'fake-token';

            User.findById.mockReturnValue({
                select: vi.fn().mockResolvedValue({
                    _id: '123',
                    email: 'testuser@gmail.com',
                    username: 'testuser'
                })
            });

            verifyToken.mockReturnValue({id: '123'});

            const req = createMockRequest({
                            method: 'GET',
                            token: 'fake-token'
                        });


            // mock the cookies
            req.cookies = {
                get: vi.fn(() => ({value: 'fake-token'}))
            };

            const res = await meRoute(req);
            const data = await res.json();

            expect(res.status).toBe(200);

        })

        it('it returns a status 401 if not valid token', async () => {
            // const fakeToken = 'fake-token';

            verifyToken.mockReturnValue(null);

            const req = createMockRequest({
                method: 'GET',
                token: 'fake-token'
            });


            // mock the cookies
            req.cookies = {
                get: vi.fn(() => ({value: 'wrong-token'
                }))
            };

            const res = await meRoute(req);
            const data = await res.json();

            expect(res.status).toBe(401);

        })

    })
})
