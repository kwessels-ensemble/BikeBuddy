import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;
export const maxAge = 1 * 24 * 60 * 60;

export function createToken(id) {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: maxAge
    });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, jwtSecret);
    } catch (err) {
        console.log(err);
        return null;
    }
}

