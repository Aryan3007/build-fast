import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { extractSubdomain } from "./lib/subdomain-utils";

const isPublicRoute = createRouteMatcher([
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhooks(.*)",
    "/templates(.*)",
    "/preview(.*)",
    "/api/public(.*)", // Public API for fetching published projects
]);

export default clerkMiddleware(async (auth, request) => {
    const hostname = request.headers.get('host') || '';
    const subdomain = extractSubdomain(hostname);

    // If there's a subdomain, rewrite to the public subdomain page
    if (subdomain && !request.nextUrl.pathname.startsWith(`/${subdomain}`)) {
        console.log(`🌐 Subdomain detected: ${subdomain}`);

        const url = request.nextUrl.clone();
        url.pathname = `/${subdomain}${url.pathname}`;

        return NextResponse.rewrite(url);
    }

    // Protect non-public routes (including /admin)
    // Subdomain routes are public
    if (!isPublicRoute(request) && !subdomain) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
