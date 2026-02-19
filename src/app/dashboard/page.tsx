"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MOCK_WORKOUTS: Record<string, { id: string; name: string; exercises: number }[]> = {
  "2026-02-16": [
    { id: "1", name: "Upper Body Push", exercises: 5 },
    { id: "2", name: "Cardio Session", exercises: 3 },
  ],
  "2026-02-15": [
    { id: "3", name: "Lower Body", exercises: 6 },
  ],
  "2026-02-14": [
    { id: "4", name: "Upper Body Pull", exercises: 4 },
    { id: "5", name: "Core Work", exercises: 3 },
    { id: "6", name: "Stretching", exercises: 5 },
  ],
};

function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  const dateKey = getDateKey(date);
  const workouts = MOCK_WORKOUTS[dateKey] ?? [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Select Date</h3>
          <Card>
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(day) => day && setDate(day)}
              />
            </CardContent>
          </Card>
        </div>

        <section>
          <h3 className="text-lg font-semibold mb-4">
            Workouts for {format(date, "do MMM yyyy")}
          </h3>

          {workouts.length === 0 ? (
            <p className="text-muted-foreground">No workouts logged for this date.</p>
          ) : (
            <div className="space-y-3">
              {workouts.map((workout) => (
                <Card key={workout.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{workout.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {workout.exercises} exercise{workout.exercises !== 1 && "s"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
