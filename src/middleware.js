
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(req) {

    // redirect if no token for protected paths
    // console.log('middleware running');
    const token = req.cookies.get('token')?.value;
    // console.log(token);

    const protectedPaths = ["/saved-rides", "/scheduled-rides", '/ride-feed'];
    const { pathname } = req.nextUrl;

    // handle redirect to login if not a valid token for any protected paths
    if (protectedPaths.some((protectedPath) => pathname.startsWith(protectedPath))) {
        // console.log("detected a protected path")
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    // proceed if token present or if route not protected
    return NextResponse.next();
}