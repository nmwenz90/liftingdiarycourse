"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  name: z.string().min(1, "Workout name is required"),
  startedAt: z.date(),
});

type UpdateWorkoutParams = z.infer<typeof updateWorkoutSchema>;

export async function editWorkout(params: UpdateWorkoutParams) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const { workoutId, name, startedAt } = updateWorkoutSchema.parse(params);
  await updateWorkout(userId, workoutId, name, startedAt);
}
