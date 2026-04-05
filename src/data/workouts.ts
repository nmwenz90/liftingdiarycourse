import { and, eq, gte, lt } from "drizzle-orm";
import { db } from "@/db";
import { workouts, workoutExercises } from "@/db/schema";

export async function insertWorkout(
  userId: string,
  name: string,
  startedAt: Date
) {
  return db.insert(workouts).values({ userId, name, startedAt });
}

export async function getWorkoutsByDate(userId: string, date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const results = await db
    .select({
      id: workouts.id,
      name: workouts.name,
      startedAt: workouts.startedAt,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.startedAt, startOfDay),
        lt(workouts.startedAt, endOfDay)
      )
    )
    .groupBy(workouts.id, workouts.name, workouts.startedAt);

  return results;
}

export async function getWorkoutsWithExerciseCount(
  userId: string,
  date: Date
) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const userWorkouts = await db.query.workouts.findMany({
    where: and(
      eq(workouts.userId, userId),
      gte(workouts.startedAt, startOfDay),
      lt(workouts.startedAt, endOfDay)
    ),
    with: {
      workoutExercises: true,
    },
  });

  return userWorkouts.map((workout) => ({
    id: workout.id,
    name: workout.name,
    startedAt: workout.startedAt,
    exerciseCount: workout.workoutExercises.length,
  }));
}

export async function getWorkoutById(userId: string, workoutId: number) {
  const result = await db
    .select({
      id: workouts.id,
      name: workouts.name,
      startedAt: workouts.startedAt,
    })
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .limit(1);

  return result[0] ?? null;
}

export async function updateWorkout(
  userId: string,
  workoutId: number,
  name: string,
  startedAt: Date
) {
  return db
    .update(workouts)
    .set({ name, startedAt })
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
