# Data Fetching Standards

## Server Components Only

**ALL data fetching MUST be done in server components.** This is a hard rule with no exceptions.

Do NOT fetch data via:

- Route handlers (`app/api/` routes)
- Client components (`"use client"`)
- `useEffect`, `fetch` in the browser, or any client-side data fetching library

If a client component needs data, pass it down as props from a parent server component.

## Database Queries via `/data` Helper Functions

All database queries MUST go through helper functions located in the `src/data/` directory. These helpers are the **only** place where database access should occur.

- Use **Drizzle ORM** for all queries. **Do NOT use raw SQL.**
- Import and call these helpers from server components — never from client components or route handlers.

Example structure:

```
src/data/
  workouts.ts    # helpers for workout queries
  exercises.ts   # helpers for exercise queries
```

## User Data Isolation (Critical)

A logged-in user must **ONLY** be able to access their own data. They must **NEVER** be able to read, modify, or delete another user's data.

**Every single query** in the `/data` helpers must filter by the authenticated user's ID. No exceptions.

```ts
// CORRECT — always scope to the current user
export async function getWorkouts(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}

// WRONG — never return unscoped data
export async function getWorkouts() {
  return db.select().from(workouts);
}
```

Always obtain the user ID from the server-side auth session and pass it into every data helper. Never trust a user-supplied ID from the client.
