export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getWorkoutsWithExerciseCount } from "@/data/workouts";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { date: dateParam } = await searchParams;

  const selectedDate = dateParam ? new Date(dateParam + "T00:00:00") : new Date();

  const workouts = await getWorkoutsWithExerciseCount(userId, selectedDate);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <DashboardClient workouts={workouts} selectedDate={selectedDate} />
    </main>
  );
}
