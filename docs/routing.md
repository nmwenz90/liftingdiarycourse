# Routing Coding Standards

## Route Structure

All application routes must be nested under `/dashboard`. There are no authenticated pages outside of this prefix.

```
/                          → public landing/sign-in redirect
/sign-in                   → public (Clerk sign-in)
/sign-up                   → public (Clerk sign-up)
/dashboard                 → protected (main app entry point)
/dashboard/workout/new     → protected
/dashboard/workout/[id]    → protected
```

Do not create top-level authenticated pages. If a feature requires a new page, it belongs under `/dashboard`.

## Route Protection

Route protection is handled exclusively via **Next.js middleware** (`src/middleware.ts`). Do not add redirect logic inside page components or layouts to enforce authentication.

The middleware uses Clerk to protect all routes except explicitly declared public ones:

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

All routes under `/dashboard` are protected by default through this middleware — no additional guards are needed at the page level.

## Adding New Routes

When adding a new page:

1. Place it under `src/app/dashboard/`.
2. No additional auth checks are needed in the page component — the middleware handles it.
3. Declare any new **public** routes explicitly in the `isPublicRoute` matcher in `middleware.ts`. Everything else is protected automatically.
