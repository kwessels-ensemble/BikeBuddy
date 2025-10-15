import {describe, it, expect, vi} from 'vitest';
import { Request } from 'undici';
import User from '@/models/User';

// mock db connection-
vi.mock('@/lib/mongodb', () => ({
    connectToDb: vi.fn(),
}));

// mock users model
vi.mock('@/models/User', () => ({
  default: {
    findOne: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({
      _id: '123',
      email: 'testuser123456@gmail.com',
      username: 'testuser123456',
    }),
  },
}));

// mock bcrypt
vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn().mockResolvedValue(true),
  },
}))

// mock jwt
vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(() => 'fake-jwt-token'),
  },
}))


import { POST } from '@/app/api/auth/signup/route';

describe('POST /api/auth/signup', () => {
    it('it returns a status 201 if signup successful', async () => {
        const req = new Request('http://localhost', {
            method: 'POST',
            body: JSON.stringify({
                email: 'testuser123@gmail.com',
                username: 'testuser123',
                password: 'password'
            }),
            headers: { 'Content-Type': 'application/json' },

        });

        const res = await POST(req);
        const data = await res.json();
        console.log(data);
        expect(res.status).toBe(201);

    })

    it('it returns a status 400 if input validation errors', async () => {
        User.findOne.mockResolvedValueOnce({ _id: '123', email: 'testuser123@example.com' });

        const req = new Request('http://localhost', {
            method: 'POST',
            body: JSON.stringify({
                email: 'testuser123@gmail.com',
                username: 'testuser123',
                password: 'password'
            }),
            headers: { 'Content-Type': 'application/json' },

        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.errors).toBeDefined();

    })

})