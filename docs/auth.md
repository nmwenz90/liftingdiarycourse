# Auth Coding Standards

## Auth Provider

This app uses **Clerk** for all authentication. Do not implement any custom auth logic, session management, or token handling. Clerk manages sign-up, sign-in, and session lifecycle entirely.

## Middleware

Clerk's middleware must be configured in `middleware.ts` at the project root to protect routes. Define public routes explicitly — all other routes are protected by default.

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
```

## Getting the Current User

Always use Clerk's server-side helpers to obtain the authenticated user's ID. **Never** trust a user ID passed from the client.

- In **server components and data helpers**, use `auth()` from `@clerk/nextjs/server`:

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();

if (!userId) {
  throw new Error("Unauthenticated");
}
```

- In **client components**, use the `useUser` or `useAuth` hooks from `@clerk/nextjs`:

```ts
"use client";
import { useUser } from "@clerk/nextjs";

const { user } = useUser();
```

Client components should only use auth state for UI purposes (e.g. displaying the user's name). They must **never** use client-side auth state to gate data access — that must always be enforced server-side.

## Sign-In and Sign-Up Pages

Use Clerk's pre-built components. Do not build custom auth forms.

```tsx
// src/app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return <SignIn />;
}
```

```tsx
// src/app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return <SignUp />;
}
```

## User Data Isolation

Every database query must be scoped to the authenticated user's ID obtained server-side. See `docs/data-fetching.md` for the full rule and examples — this is a critical security requirement.
