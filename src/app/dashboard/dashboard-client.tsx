"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Workout = {
  id: number;
  name: string;
  startedAt: Date;
  exerciseCount: number;
};

export default function DashboardClient({
  workouts,
  selectedDate,
}: {
  workouts: Workout[];
  selectedDate: Date;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleDateSelect(day: Date | undefined) {
    if (!day) return;
    const params = new URLSearchParams(searchParams.toString());
    const dateKey = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    params.set("date", dateKey);
    router.push(`/dashboard?${params.toString()}`);
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Date</h3>
        <Card>
          <CardContent className="p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
            />
          </CardContent>
        </Card>
      </div>

      <section>
        <h3 className="text-lg font-semibold mb-4">
          Workouts for {format(selectedDate, "do MMM yyyy")}
        </h3>

        {workouts.length === 0 ? (
          <p className="text-muted-foreground">
            No workouts logged for this date.
          </p>
        ) : (
          <div className="space-y-3">
            {workouts.map((workout) => (
              <Link key={workout.id} href={`/dashboard/workout/${workout.id}`}>
                <Card className="hover:bg-accent transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{workout.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {workout.exerciseCount} exercise
                      {workout.exerciseCount !== 1 && "s"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
