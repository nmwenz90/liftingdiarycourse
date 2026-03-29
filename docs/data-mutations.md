# Data Mutation Standards

## Server Actions Only

**ALL data mutations MUST be done via Next.js Server Actions.** This is a hard rule with no exceptions.

Do NOT mutate data via:

- Route handlers (`app/api/` routes)
- Client-side `fetch` calls or third-party mutation libraries
- Direct database calls from components (server or client)

## Colocated `actions.ts` Files

Server actions must live in `actions.ts` files colocated with the route or feature they belong to.

```
src/app/
  dashboard/
    page.tsx
    actions.ts    # server actions for the dashboard route
  workouts/
    [id]/
      page.tsx
      actions.ts  # server actions scoped to a specific workout
```

Every `actions.ts` file must begin with the `"use server"` directive.

```ts
"use server";
```

## Typed Parameters — No `FormData`

All server action parameters must be explicitly typed. **Do NOT use `FormData` as a parameter type.** Accept plain typed objects instead.

```ts
// CORRECT — explicit typed params
export async function createWorkout(params: CreateWorkoutParams) { ... }

// WRONG — FormData is not allowed
export async function createWorkout(formData: FormData) { ... }
```

## Zod Validation

**Every server action MUST validate its arguments using Zod** before doing anything else. Never trust the data passed in, even from your own client components.

Define a Zod schema for each action's input and call `.parse()` or `.safeParse()` at the top of the function body.

```ts
"use server";

import { z } from "zod";

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  startedAt: z.date(),
});

type CreateWorkoutParams = z.infer<typeof createWorkoutSchema>;

export async function createWorkout(params: CreateWorkoutParams) {
  const validated = createWorkoutSchema.parse(params);
  // proceed with validated data
}
```

Use `.safeParse()` when you want to return a structured error to the caller rather than throw.

```ts
export async function createWorkout(params: CreateWorkoutParams) {
  const result = createWorkoutSchema.safeParse(params);
  if (!result.success) {
    return { error: result.error.flatten() };
  }
  // proceed with result.data
}
```

## Data Helpers in `src/data/`

Server actions must **never** call Drizzle directly. All database writes must go through helper functions in the `src/data/` directory, mirroring the same rule that applies to reads.

```
src/data/
  workouts.ts    # read AND write helpers for workouts
  exercises.ts   # read AND write helpers for exercises
```

The helper function is the only place where Drizzle ORM is called.

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";

export async function insertWorkout(
  userId: string,
  name: string,
  startedAt: Date
) {
  return db.insert(workouts).values({ userId, name, startedAt });
}
```

```ts
// src/app/dashboard/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { insertWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  startedAt: z.date(),
});

type CreateWorkoutParams = z.infer<typeof createWorkoutSchema>;

export async function createWorkout(params: CreateWorkoutParams) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const { name, startedAt } = createWorkoutSchema.parse(params);
  await insertWorkout(userId, name, startedAt);
}
```

## User Data Isolation (Critical)

The same isolation rule that applies to reads applies to writes. A user must **NEVER** be able to modify or delete another user's data.

- Always obtain `userId` from the server-side Clerk session (`auth()`), never from the client.
- Always scope `UPDATE` and `DELETE` queries with a `userId` condition.

```ts
// CORRECT — scoped delete
export async function deleteWorkout(userId: string, workoutId: number) {
  return db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}

// WRONG — unscoped delete
export async function deleteWorkout(workoutId: number) {
  return db.delete(workouts).where(eq(workouts.id, workoutId));
}
```

## No Redirects Inside Server Actions

**Do NOT call `redirect()` inside a server action.** Redirects must be handled client-side after the server action resolves.

```ts
// WRONG — redirect inside a server action
export async function createWorkout(params: CreateWorkoutParams) {
  await insertWorkout(userId, name, startedAt);
  redirect("/dashboard"); // ❌
}

// CORRECT — action returns, client handles navigation
export async function createWorkout(params: CreateWorkoutParams) {
  await insertWorkout(userId, name, startedAt);
  // return nothing (or a result) — let the caller redirect
}
```

```tsx
// In the client component
async function handleSubmit() {
  await createWorkout({ name, startedAt });
  router.push("/dashboard"); // ✅ redirect happens client-side
}
```

## Summary of Rules

| Rule | Requirement |
|---|---|
| Mutation mechanism | Server actions only |
| File name | `actions.ts`, colocated with the route |
| Directive | `"use server"` at the top of every `actions.ts` |
| Parameter types | Explicit TypeScript types — no `FormData` |
| Input validation | Zod schema required in every action |
| Database access | Via `src/data/` helpers only — no direct Drizzle calls in actions |
| User scoping | Always filter writes by authenticated `userId` from Clerk |
| Redirects | Never use `redirect()` in server actions — redirect client-side after the action resolves |
