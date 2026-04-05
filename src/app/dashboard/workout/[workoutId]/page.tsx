import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getWorkoutById } from "@/data/workouts";
import EditWorkoutForm from "./edit-workout-form";

type Props = {
  params: Promise<{ workoutId: string }>;
};

export default async function EditWorkoutPage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { workoutId } = await params;
  const id = Number(workoutId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const workout = await getWorkoutById(userId, id);
  if (!workout) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Edit Workout</h2>
      <EditWorkoutForm
        workoutId={workout.id}
        initialName={workout.name}
        initialStartedAt={workout.startedAt}
      />
    </main>
  );
}
