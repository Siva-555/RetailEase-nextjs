import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/", "/api(.*)?",]);
const isOnboardingRoute = createRouteMatcher(["/onboarding"]);

const isModeratorRoute = createRouteMatcher(["/billing(.*)?","/settings", "/settings/user-profile",]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  const isPublic = isPublicRoute(req);
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  
  if (!isPublic) {
    await auth.protect();
  }
 
  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId && !isPublic)
    return redirectToSignIn({ returnBackUrl: req.url });

  // Catch users who do not have `onboardingComplete: true` in their publicMetadata
  // Redirect them to the /onboarding route to complete onboarding
  if (userId && !sessionClaims?.metadata?.onboardingComplete) {
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  if (!isPublic && role === "moderator" && !isModeratorRoute(req)) {
    // return NextResponse.rewrite(new URL("/not-found", req.url));
    return NextResponse.redirect(new URL("/billing/history", req.url));
  }

  // For users visiting /onboarding, don't try to redirect
  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next();
  }
   return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
