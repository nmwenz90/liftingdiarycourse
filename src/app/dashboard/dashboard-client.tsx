"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Workout = {
  id: number;
  name: string;
  startedAt: Date;
  exerciseCount: number;
};

function parseDateString(dateString?: string): Date {
  if (dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date();
}

export default function DashboardClient({
  workouts,
  dateString,
}: {
  workouts: Workout[];
  dateString?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const selectedDate = parseDateString(dateString);

  function handleDateSelect(day: Date | undefined) {
    if (!day) return;
    const params = new URLSearchParams(searchParams.toString());
    const dateKey = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    params.set("date", dateKey);
    setOpen(false);
    router.push(`/dashboard?${params.toString()}`);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Select Date</h3>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, "do MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Workouts for {format(selectedDate, "do MMM yyyy")}
          </h3>
          <Link href="/dashboard/workout/new">
            <Button>Log New Workout</Button>
          </Link>
        </div>

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

