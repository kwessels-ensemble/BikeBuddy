import {describe, it, expect, vi} from 'vitest';
import { createMockRequest } from '../setup';
import { Request } from 'undici';
import User from '@/models/User';
import SavedRide from '@/models/SavedRide';
import { verifyToken } from '@/lib/auth';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

import {POST} from '@/app/api/saved-rides/route';
import {PATCH} from '@/app/api/saved-rides/[rideId]/route';
import {DELETE} from '@/app/api/saved-rides/[rideId]/route';

describe('SavedRides API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('POST /api/saved-rides', () => {
        it('it returns a status 201 if saved ride creation successful', async () => {

            const req = createMockRequest({
                method: 'POST',
                body: {
                    title: "Test Ride2",
                    description: "test2 bla bla bla",
                    link: "",
                    type: "gravel",
                    notes: "",
                    location: {"city": "San Francisco",
                                            "state": "CA"}
                },
                token: 'fake-token'
            });


            const fakeUserId = new ObjectId();
            console.log(fakeUserId);
            verifyToken.mockReturnValue({ id: fakeUserId });

            SavedRide.create.mockResolvedValue({
                _id: new ObjectId(),
                userId: fakeUserId,
                title: "Test Ride2",
                description: "test2 bla bla bla",
                link: "",
                type: "gravel",
                notes: "",
                location: {"city": "San Francisco",
                                        "state": "CA"}
            })
            const res = await POST(req);
            const data = await res.json();

            expect(res.status).toBe(201);


        })

        it('it returns a status 400 if saved ride input failed', async () => {

            const req = createMockRequest({
                method: 'POST',
                body: {
                    title: "",
                    description: "test2 bla bla bla",
                    link: "",
                    type: "",
                    notes: "",
                    location: {"city": "San Francisco",
                                            "state": "CA"}
                },
                token: 'fake-token'
            });


            const fakeUserId = new ObjectId();
            console.log(fakeUserId);
            verifyToken.mockReturnValue({ id: fakeUserId });

            // this doesn't matter because reoute code shouldn't get here even, should fail due to input validators
            SavedRide.create.mockResolvedValue({
                _id: new ObjectId(),
                userId: fakeUserId,
                title: "Test Ride2",
                description: "test2 bla bla bla",
                link: "",
                type: "gravel",
                notes: "",
                location: {"city": "San Francisco",
                                        "state": "CA"}
            })
            const res = await POST(req);
            const data = await res.json();

            expect(res.status).toBe(400);


        })

    describe('PATCH /api/saved-rides/:rideId', () => {
        it('it returns a status 200 if saved ride update successful', async () => {

            const fakeRideId = new ObjectId();

            const req = createMockRequest({
                method: 'PATCH',
                body: {
                    title: "Updated Title",
                },
                token: 'fake-token'
            });


            const fakeUserId = new ObjectId();
            // console.log(fakeUserId);

            verifyToken.mockReturnValue({ id: fakeUserId });

            SavedRide.findById.mockResolvedValue({
                _id: fakeRideId.toString(),
                userId: fakeUserId.toString(),
                save: vi.fn().mockResolvedValue(true)
            })

            const res = await PATCH(req,
                {params: {rideId: fakeRideId.toString()}}
            );
            const data = await res.json();
            // console.log(data);
            expect(res.status).toBe(200);


        })

        it('it returns a status 403 if user not authorized', async () => {

            const fakeRideId = new ObjectId();

            const req = createMockRequest({
                method: 'PATCH',
                body: {
                    title: "Updated Title",
                },
                token: 'fake-token'
            });


            const fakeUserId = new ObjectId();
            // console.log(fakeUserId);

            verifyToken.mockReturnValue({ id: fakeUserId });

            SavedRide.findById.mockResolvedValue({
                _id: fakeRideId.toString(),
                userId: new ObjectId().toString(),
                save: vi.fn().mockResolvedValue(true)
            })

            const res = await PATCH(req,
                {params: {rideId: fakeRideId.toString()}}
            );
            const data = await res.json();
            // console.log(data);
            expect(res.status).toBe(403);


        })



    })



    describe('DELETE /api/saved-rides/:rideId', () => {
        it('it returns a status 200 if ride deleted', async () => {

            const fakeRideId = new ObjectId();

            const req = createMockRequest({
                method: 'DELETE',
                token: 'fake-token'
            });

            const fakeUserId = new ObjectId();

            verifyToken.mockReturnValue({ id: fakeUserId });

            SavedRide.findById.mockResolvedValue({
                _id: fakeRideId.toString(),
                userId: fakeUserId.toString(),
                save: vi.fn().mockResolvedValue(true)
            })

            const res = await DELETE(req,
                {params: {rideId: fakeRideId.toString()}}
            );

            const data = await res.json();
            // console.log(data);
            expect(res.status).toBe(200);


        })

    })

        it('it returns a status 403 if user not authorized', async () => {

            const fakeRideId = new ObjectId();

            const req = createMockRequest({
                method: 'DELETE',
                token: 'fake-token'
            });

            const fakeUserId = new ObjectId();

            verifyToken.mockReturnValue({ id: fakeUserId });

            SavedRide.findById.mockResolvedValue({
                _id: fakeRideId.toString(),
                userId: new ObjectId(),
                save: vi.fn().mockResolvedValue(true)
            })

            const res = await DELETE(req,
                {params: {rideId: fakeRideId.toString()}}
            );

            const data = await res.json();
            // console.log(data);
            expect(res.status).toBe(403);


        })

    })


})






