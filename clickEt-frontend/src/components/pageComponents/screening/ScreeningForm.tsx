"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// shadcn/shadcn components
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { Label } from "@/components/shadcn/label";

// API hooks
import { useFetchAllMovies } from "@/api/movieApi";
import { useFetchDistributorsByMovie } from "@/api/distributorApi";
import { useFetchAllTheatres } from "@/api/theatreApi";
import { useGetHallsByTheatre } from "@/api/hallApi";
import { useCreateScreening } from "@/api/screeningApi";
import { Card, CardHeader } from "@/components/shadcn/card";

// Toast utility

interface ScreeningFormValues {
  movieId: string;
  distributorId: string;
  theatreId: string;
  hallId: string;
  startTime: Date;
  additionalMinutes: number;
  basePrice: number;
}

export function ScreeningForm() {
  const { register, handleSubmit, watch, setValue } =
    useForm<ScreeningFormValues>({
      defaultValues: {
        startTime: new Date(),
        additionalMinutes: 0,
        basePrice: 0,
      },
    });

  const [endTime, setEndTime] = useState<Date>(new Date());
  const [duration, setDuration] = useState<number | null>(null);
  const movieId = watch("movieId");
  const theatreId = watch("theatreId");

  // Fetch necessary data
  const { data: movies } = useFetchAllMovies();
  const { data: distributors } = useFetchDistributorsByMovie(movieId || "");
  const { data: theatres } = useFetchAllTheatres();
  const { data: halls } = useGetHallsByTheatre(theatreId || "");

  // Mutation hook for creating screenings
  const { mutate: createScreening, isPending } = useCreateScreening();

  // Recalculate end time whenever relevant fields change
  useEffect(() => {
    if (movieId && duration) {
      const start = watch("startTime") || new Date();
      const totalMinutes = duration + (watch("additionalMinutes") || 0);
      const newEndTime = new Date(start.getTime() + totalMinutes * 60000);
      setEndTime(newEndTime);
    }
  }, [
    watch,
    movieId,
    duration,
    watch("startTime"),
    watch("additionalMinutes"),
  ]);

  const onSubmit = (data: ScreeningFormValues) => {
    createScreening({ ...data, endTime });
  };

  return (
    <Card className="">
      <CardHeader>
        <span className="text-3xl text-primary font-semibold">Create Screening</span>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
        {/* Movie */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="movieId">Select Movie</Label>
          <Select
            onValueChange={(val) => {
              setValue("movieId", val);
              // Get the movie duration
              const foundMovie = movies?.find((m) => m._id === val);
              setDuration(Number(foundMovie?.duration_min) || null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a movie" />
            </SelectTrigger>
            <SelectContent>
              {movies?.map((movie) => (
                <SelectItem key={movie._id} value={movie._id}>
                  {movie.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Distributor */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="distributorId">Select Distributor</Label>
          <Select onValueChange={(val) => setValue("distributorId", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a distributor" />
            </SelectTrigger>
            <SelectContent>
              {distributors?.map((dist) => (
                <SelectItem key={dist._id} value={dist._id}>
                  {dist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Theatre */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="theatreId">Select Theatre</Label>
          <Select onValueChange={(val) => setValue("theatreId", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a theatre" />
            </SelectTrigger>
            <SelectContent>
              {theatres?.map((theatre) => (
                <SelectItem key={theatre._id} value={theatre._id}>
                  {theatre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Hall */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="hallId">Select Hall</Label>
          <Select onValueChange={(val) => setValue("hallId", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a hall" />
            </SelectTrigger>
            <SelectContent>
              {halls?.map((hall) => (
                <SelectItem key={hall._id} value={hall._id}>
                  {hall.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Start Time */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="startTime">Start Time</Label>
          <DatePicker
            selected={watch("startTime")}
            onChange={(date: Date) => setValue("startTime", date)}
            showTimeSelect
            dateFormat="Pp"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none"
          />
        </div>

        {/* Additional Minutes */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="additionalMinutes">Additional Minutes</Label>
          <Input
            id="additionalMinutes"
            type="number"
            step="1"
            {...register("additionalMinutes", {
              required: true,
              valueAsNumber: true,
            })}
          />
        </div>

        {/* Calculated End Time (read-only) */}
        <div className="flex flex-col space-y-1">
          <Label>Calculated End Time</Label>
          <DatePicker
            selected={endTime}
            readOnly
            dateFormat="Pp"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none"
          />
        </div>

        {/* Base Price */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="basePrice">Base Price</Label>
          <Input
            id="basePrice"
            type="number"
            step="0.01"
            {...register("basePrice", { required: true, valueAsNumber: true })}
          />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Screening"}
        </Button>
      </form>
    </Card>
  );
}
