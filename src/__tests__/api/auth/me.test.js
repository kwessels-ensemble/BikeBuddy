import {describe, it, expect, vi} from 'vitest';
import { Request } from 'undici';
// import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// mock db connection-
vi.mock('@/lib/mongodb', () => ({
    connectToDb: vi.fn(),
}));

vi.mock('@/models/User', () => ({
  default: {
    findById: vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue({
        _id: '123',
        email: 'testuser@gmail.com',
        username: 'testuser',
      }),
    }),
  },
}));

vi.mock('@/lib/auth', () => ({
  verifyToken: vi.fn(),   // no "default"
}));



import { GET } from '@/app/api/auth/me/route';

describe('GET /api/auth/me', () => {
    it('it returns a status 200 if request successful', async () => {
        const fakeToken = 'fake-token';

        verifyToken.mockReturnValue({id: '123'});

        const req = new Request('http://localhost', {
            method: 'GET',
            headers: {
                cookie: `token=${fakeToken}`,
             },

        });

        // mock the cookies
        req.cookies = {
            get: vi.fn(() => ({value: fakeToken}))
        };

        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(200);

    })

    it('it returns a status 401 if not valid token', async () => {
        const fakeToken = 'fake-token';

        verifyToken.mockReturnValue(null);

        const req = new Request('http://localhost', {
            method: 'GET',
            headers: {
                cookie: `token=${fakeToken}`,
             },

        });

        // mock the cookies
        req.cookies = {
            get: vi.fn(() => ({value: 'wrong-token'
            }))
        };

        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(401);

    })




})