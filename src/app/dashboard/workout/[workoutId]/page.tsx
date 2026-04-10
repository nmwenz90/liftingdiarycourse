import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { getWorkoutById } from "@/data/workouts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { workoutId } = await params;
  const id = parseInt(workoutId, 10);

  if (isNaN(id)) {
    notFound();
  }

  const workout = await getWorkoutById(userId, id);

  if (!workout) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/dashboard"
        className="text-sm text-muted-foreground hover:underline mb-6 inline-block"
      >
        ← Back to Dashboard
      </Link>
      <h2 className="text-2xl font-bold mb-1">{workout.name}</h2>
      <p className="text-muted-foreground mb-8">
        {format(workout.startedAt, "do MMM yyyy")}
      </p>

      {workout.workoutExercises.length === 0 ? (
        <p className="text-muted-foreground">No exercises recorded.</p>
      ) : (
        <div className="space-y-4">
          {workout.workoutExercises.map((we) => (
            <Card key={we.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{we.exercise.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {we.sets.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No sets recorded.</p>
                ) : (
                  <div className="space-y-1">
                    {we.sets.map((set) => (
                      <p key={set.id} className="text-sm">
                        Set {set.setNumber}: {set.reps} reps @ {set.weight} kg
                      </p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
