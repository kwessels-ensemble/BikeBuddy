import {describe, it, expect, vi} from 'vitest';
import { Request } from 'undici';

// import * as db  from '@/lib/mongodb';


// mock db connection-
vi.mock('@/lib/mongodb', () => ({
    connectToDb: vi.fn(),
}));

vi.mock('@/models/User', () => ({
  default: {
    findOne: vi.fn().mockResolvedValue({
      _id: '123',
      password: '$2b$10$hashedpassword', // fake bcrypt hash
    }),
  },
}))

// Mock bcrypt (default export)
vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn().mockResolvedValue(true),
  },
}))


vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(() => 'fake-jwt-token'),
  },
}))


import { POST } from '@/app/api/auth/login/route';


describe('POST /api/auth/login', () => {
    it('it returns a status 200 if login successful', async () => {
        const req = new Request('http://localhost', {
            method: 'POST',
            body: JSON.stringify({
                email: 'katewessels@gmail.com',
                password: 'password'
            }),
            headers: { 'Content-Type': 'application/json' },

        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(200);

    })

    it('it returns a status 400 if input validation errors', async () => {
        const req = new Request('http://localhost', {
            method: 'POST',
            body: JSON.stringify({
                email: 'katewessels',
                password: 'pass'
            }),
            headers: { 'Content-Type': 'application/json' },

        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(400);

    })
})