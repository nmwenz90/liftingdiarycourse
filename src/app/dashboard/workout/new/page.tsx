import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NewWorkoutForm from "./new-workout-form";

export default async function NewWorkoutPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Create Workout</h2>
      <NewWorkoutForm />
    </main>
  );
}
