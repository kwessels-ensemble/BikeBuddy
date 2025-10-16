
import { vi } from "vitest";
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

// mocks to be used in api endpoint testing
// and a helper function to add cookies, json, and headers to the mock requests

// mock db connection-
vi.mock('@/lib/mongodb', () => ({
    connectToDb: vi.fn(),
}));

vi.mock('@/models/User', () => ({
    default: {
        findOne: vi.fn(),
        findById: vi.fn(),
        create: vi.fn()
    },
}));

// vi.mock('@/models/SavedRide', () => ({
//     default: {
//         findOne: vi.fn(),
//         findById: vi.fn(),
//         create: vi.fn()
//     },
// }));

vi.mock('@/models/SavedRide', () => {
  // Mock class to simulate Mongoose model
    class SavedRideMock {
        constructor(data) {
        // assign the passed data to this instance
        Object.assign(this, data);
        this._id = new ObjectId(); // give it a fake ObjectId
        }

        // simulate .save() instance method
        save() {
        return Promise.resolve(this);
        }

        // optional: you can add more instance methods if needed
    }

    // static methods like .create()
    SavedRideMock.create = vi.fn().mockImplementation((data) => {
        return Promise.resolve(new SavedRideMock(data));
    });

    SavedRideMock.findById = vi.fn();
    SavedRideMock.findOne = vi.fn();

    return { default: SavedRideMock };
});



// mock bcrypt
vi.mock('bcrypt', () => ({
    default: {
        compare: vi.fn().mockResolvedValue(true),
        hash: vi.fn().mockResolvedValue("hashedpassword"),
    },
}))

// mock jwt
vi.mock('jsonwebtoken', () => ({
    default: {
        sign: vi.fn(() => 'fake-jwt-token'),
        verify: vi.fn(() => ({ id: "123"})),
    },
}))

vi.mock('@/lib/auth', () => ({
    verifyToken: vi.fn(()=> ({ id: '123'})),
    createToken: vi.fn(() => ({token: 'fake-jwt-token'})),
    maxAge: 1 * 24 * 60 * 60
}));

// helper function
export function createMockRequest({body, method = 'GET', token}) {
    const req = new Request('http://localhost', {
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: {
            'Content-Type': 'application/json',
        }
    });
    req.cookies = { get: () => (token ? {value: token} : undefined)}
    return req;
}

console.log('setup.js is loaded.')