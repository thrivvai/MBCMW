import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Teacher and admin routes require Clerk auth.
const isTeacherRoute = createRouteMatcher(["/teacher(.*)", "/api/sessions(.*)"]);
// Student routes and join are public — session code is the authorization.
const isPublicRoute = createRouteMatcher([
  "/",
  "/join(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/student(.*)",
  "/api/sessions/join(.*)",
  "/api/missions(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
