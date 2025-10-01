
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export function middleware(req) {

    // verify token
    console.log('middleware running');
    const token = req.cookies.get('token')?.value;
    console.log(token);
    const verified = token && verifyToken(token);
    console.log(verified);

    // TODO - confirm we don't want to add the api routes to protectedPaths and instead handle in route itself
    const protectedPaths = ["/rides", "/scheduled-rides", '/feed'];
    const { pathname } = req.nextUrl;

    // handle redirect to login if not a valid token for any protected paths
    if (protectedPaths.some((protectedPath) => pathname.startsWith(protectedPath))) {
        console.log("detected a protected path")
        if (!verified) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    // proceed if valid token or if route not protected
    return NextResponse.next();
}