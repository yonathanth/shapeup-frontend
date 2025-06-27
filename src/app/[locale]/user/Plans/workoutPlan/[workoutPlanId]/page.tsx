"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faPlay,
  faTimes,
  faChevronLeft,
  faChevronRight,
  faCalendarDays,
  faDumbbell,
  faFire,
  faTarget,
  faExpandAlt,
  faCompress,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import LoadingPage from "@/src/app/[locale]/user/loading";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ExerciseType {
  id: string;
  slug: string;
  name: string;
  description: string;
  reps: number;
  sets: number;
  duration: number;
  videoUrl: string;
  focusArea: string;
}

interface WorkoutPlanType {
  id: string;
  name: string;
  slug: string;
  difficulty: string;
  mainGoal: string;
  workoutType: string;
  duration: number;
  daysPerWeek: number;
  exercises: ExerciseType[];
}

interface UserWorkoutType {
  id: string;
  userId: string;
  workoutId: string;
  startedAt: Date;
  progress: number;
  finishedAt: Date;
}

export default function WorkoutPlan({
  params,
}: {
  params: { locale: string; workoutPlanId: string };
}) {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [exercise, setExercise] = useState<ExerciseType | null>(null);
  const [plan, setPlan] = useState<WorkoutPlanType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLDivElement | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const playerRef = useRef<any>(null);
  const [isYouTubeLoaderReady, setIsYouTubeLoaderReady] = useState(false);
  const [isVideoModalOpen, setVideoModalOpen] = useState(false);
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [doesWorkoutExist, setDoesWorkoutExist] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const token = localStorage.getItem("token");

  const doesWorkoutExistForUser = useCallback(
    async (workoutId: string, userId: string) => {
      try {
        const response = await axios.get(
          `${NEXT_PUBLIC_API_BASE_URL}/api/members/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userData = response.data.data.user;
        if (!userData || !Array.isArray(userData.workouts)) {
          throw new Error("Workouts section not found or invalid.");
        }
        const exists = userData.workouts.some(
          (workout: UserWorkoutType) => workout.workoutId === workoutId
        );
        setDoesWorkoutExist(exists);
        return exists;
      } catch (error) {
        setDoesWorkoutExist(false);
      }
    },
    []
  );

  const selectPlan = async (workoutId: string) => {
    const res = await fetch(
      `${NEXT_PUBLIC_API_BASE_URL}/api/members/addUserWorkout`,
      {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          workoutId: workoutId,
        }),
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to select plan ${res.statusText}`);
    }
    setDoesWorkoutExist(true);
  };

  const getWorkoutPlan = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${NEXT_PUBLIC_API_BASE_URL}/api/workouts/${id}`,
        {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch workout plan: ${res.statusText}`);
      }
      const data = await res.json();
      setPlan(data.data.workout);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    //@ts-ignore
    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
      (window as any).onYouTubeIframeAPIReady = () => {
        setIsYouTubeLoaderReady(true);
      };
    } else {
      setIsYouTubeLoaderReady(true);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await getWorkoutPlan(params.workoutPlanId);
        if (userId) {
          await doesWorkoutExistForUser(params.workoutPlanId, userId);
        }
      } catch (error) {
        console.error("Error during initialization:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.workoutPlanId, userId]);

  const initializePlayer = (videoId: string) => {
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    if (videoRef.current) {
      //@ts-ignore
      playerRef.current = new window.YT.Player(videoRef.current, {
        videoId,
        width: "100%",
        height: "100%",
        events: {
          onReady: (event: any) => {
            event.target.playVideo();
            setIsPlaying(true);
          },
          onStateChange: (event: any) => {
            //@ts-ignore
            if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              //@ts-ignore
            } else if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            }
          },
        },
      });
    }
  };

  const handleExerciseClick = (exercise: ExerciseType) => {
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
    setIsPlaying(false);
    setExercise(exercise || null);
  };

  const handlePlayVideo = () => {
    const videoId = exercise?.videoUrl;
    //@ts-ignore
    if (isYouTubeLoaderReady && window.YT && videoId) {
      initializePlayer(videoId);
    } else {
      console.log("YouTube Player not ready or missing video URL");
    }
  };

  const getCurrentDayExercises = () => {
    if (!selectedDay || !plan) return [];

    const [monthIndex, weekIndex, dayIndex] = selectedDay
      .split("-")
      .map(Number);
    const startIndex =
      (monthIndex * 4 * plan.daysPerWeek +
        weekIndex * plan.daysPerWeek +
        dayIndex) *
      5;

    return Array.from({ length: 5 }).map((_, idx) => {
      const exerciseIndex = (startIndex + idx) % plan.exercises.length;
      return plan.exercises[exerciseIndex];
    });
  };

  const navigateWeek = (direction: "prev" | "next") => {
    if (!plan) return;

    const totalWeeks = Math.ceil(plan.duration / 4) * 4;
    if (direction === "prev" && selectedWeek > 0) {
      setSelectedWeek(selectedWeek - 1);
      setSelectedDay(null);
    } else if (direction === "next" && selectedWeek < totalWeeks - 1) {
      setSelectedWeek(selectedWeek + 1);
      setSelectedDay(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "text-green-400";
      case "intermediate":
        return "text-yellow-400";
      case "advanced":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-white bg-zinc-900 p-6 rounded-lg max-w-md w-full text-center">
          <div className="text-2xl font-bold text-red-500 mb-4">Error</div>
          <div className="text-sm mb-4">{error}</div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => getWorkoutPlan(params.workoutPlanId)}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-white bg-zinc-900 p-6 rounded-lg text-center">
          <div className="text-2xl font-bold">Workout Plan Not Found</div>
        </div>
      </div>
    );
  }

  const currentExercises = getCurrentDayExercises();

  return (
    <div className="min-h-screen bg-black p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Plan Header */}
        <div className="bg-gradient-to-r from-[#151515] to-[#252525] p-4 sm:p-6 rounded-xl shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
                  {plan.name}
                </h1>
                <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
                  <span
                    className={`px-3 py-1 rounded-full bg-gray-800 ${getDifficultyColor(
                      plan.difficulty
                    )} font-medium`}
                  >
                    {plan.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-800 text-blue-400 font-medium">
                    <FontAwesomeIcon icon={faTarget} className="mr-1" />
                    {plan.mainGoal}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-800 text-purple-400 font-medium">
                    <FontAwesomeIcon icon={faDumbbell} className="mr-1" />
                    {plan.workoutType}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-customBlue" />
                  <span>{plan.duration} weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    className="text-customBlue"
                  />
                  <span>{plan.daysPerWeek} days/week</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faFire} className="text-customBlue" />
                  <span>{plan.exercises.length} exercises</span>
                </div>
              </div>

              {/* {!doesWorkoutExist && (
              <button
                  className="bg-customBlue text-black px-6 py-3 rounded-lg font-semibold hover:bg-customHoverBlue transition-colors mt-4"
                onClick={async () => {
                  await selectPlan(plan.id);
                }}
              >
                  Add to My Plans
                </button>
              )} */}
            </div>

            <div className="w-full lg:w-48 h-32 sm:h-40 lg:h-48 relative">
              <Image
                src={`${NEXT_PUBLIC_API_BASE_URL}/uploads/workouts/${plan.slug}`}
                fill
                quality={90}
                alt={plan.name}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="bg-[#151515] p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              Training Schedule
            </h2>
            <button
              className="lg:hidden bg-customBlue text-black px-4 py-2 rounded-lg text-sm font-medium"
              onClick={() => setScheduleModalOpen(true)}
            >
              View Full Schedule
            </button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateWeek("prev")}
              disabled={selectedWeek === 0}
              className="p-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <h3 className="text-white font-medium">
              Week {selectedWeek + 1} of {Math.ceil(plan.duration / 4) * 4}
            </h3>

            <button
              onClick={() => navigateWeek("next")}
              disabled={selectedWeek >= Math.ceil(plan.duration / 4) * 4 - 1}
              className="p-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>

          {/* Days of the week */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {Array.from({ length: plan.daysPerWeek }).map((_, dayIndex) => {
              const dayId = `${Math.floor(selectedWeek / 4)}-${
                selectedWeek % 4
              }-${dayIndex}`;
              const isSelected = selectedDay === dayId;

              return (
                <button
                  key={dayIndex}
                  onClick={() => setSelectedDay(dayId)}
                  className={`p-3 rounded-lg text-center transition-all duration-200 ${
                    isSelected
                      ? "bg-customBlue text-black font-semibold transform scale-105"
                      : "bg-[#1C1C1C] text-white hover:bg-[#333333]"
                  }`}
                >
                  <div className="text-xs opacity-75">Day</div>
                  <div className="text-lg font-bold">{dayIndex + 1}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Exercises List */}
          <div className="bg-[#151515] p-4 sm:p-6 rounded-xl">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
              {selectedDay
                ? `Day ${Number(selectedDay.split("-")[2]) + 1} Exercises`
                : "Select a day to view exercises"}
            </h3>

            {selectedDay && currentExercises.length > 0 ? (
              <div className="space-y-3">
                {currentExercises.map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExerciseClick(ex)}
                    className={`w-full p-4 rounded-lg transition-all duration-200 ${
                      exercise?.id === ex.id
                        ? "bg-customBlue text-black"
                        : "bg-[#1C1C1C] text-white hover:bg-[#333333]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left flex-1">
                        <div className="font-medium text-sm sm:text-base">
                          {ex.name}
                        </div>
                        <div className="text-xs opacity-75 mt-1">
                          {ex.sets} sets × {ex.reps} reps | {ex.focusArea}
                        </div>
                      </div>
                      <FontAwesomeIcon
                        icon={faPlay}
                        className={`ml-3 ${
                          exercise?.id === ex.id
                            ? "text-black"
                            : "text-customBlue"
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  size="2x"
                  className="mb-3"
                />
                <p>Select a day from the schedule above to view exercises</p>
              </div>
            )}
          </div>

          {/* Video/Exercise Display */}
          <div className="bg-[#151515] p-4 sm:p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                {exercise ? exercise.name : "Exercise Preview"}
              </h3>
              {exercise && (
                <button
                  onClick={() => setVideoModalOpen(true)}
                  className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors lg:hidden"
                >
                  <FontAwesomeIcon icon={faExpandAlt} />
                </button>
              )}
            </div>

            <div className="aspect-video bg-[#1C1C1C] rounded-lg relative overflow-hidden">
              {exercise ? (
                <>
                  {!isPlaying && (
                    <>
                      <Image
                        src={`${NEXT_PUBLIC_API_BASE_URL}/uploads/exercises/${exercise.slug}`}
                        alt={exercise.name}
                        fill
                        quality={90}
                        className="object-cover"
                      />
                      <button
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-20 transition-colors"
                        onClick={handlePlayVideo}
                      >
                        <div className="bg-white bg-opacity-20 rounded-full p-4 hover:bg-opacity-30 transition-colors">
                          <FontAwesomeIcon
                            icon={faPlay}
                            size="2x"
                            className="text-white ml-1"
                          />
                        </div>
                      </button>
                    </>
                  )}
                  <div
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full"
                  />
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <FontAwesomeIcon
                      icon={faDumbbell}
                      size="3x"
                      className="mb-4"
                    />
                    <p>Select an exercise to view details</p>
                  </div>
                </div>
              )}
            </div>

            {/* Exercise Details */}
            {exercise && (
              <div className="mt-4 space-y-3">
                <div className="bg-[#1C1C1C] p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">
                    Exercise Details
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-customBlue font-semibold">
                        {exercise.sets}
                      </div>
                      <div className="text-gray-400">Sets</div>
                    </div>
                    <div className="text-center">
                      <div className="text-customBlue font-semibold">
                        {exercise.reps}
                      </div>
                      <div className="text-gray-400">Reps</div>
                    </div>
                    <div className="text-center">
                      <div className="text-customBlue font-semibold">
                        {exercise.duration}s
                      </div>
                      <div className="text-gray-400">Duration</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">Focus Area</div>
                    <div className="text-white">{exercise.focusArea}</div>
                  </div>
                  {exercise.description && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="text-xs text-gray-400 mb-1">
                        Description
                      </div>
                      <div className="text-white text-sm">
                        {exercise.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal for Mobile */}
      {isVideoModalOpen && exercise && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-semibold">
                {exercise.name}
              </h3>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="text-white hover:text-gray-300 p-2"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            <div className="aspect-video bg-[#1C1C1C] rounded-lg relative overflow-hidden">
              <Image
                src={`${NEXT_PUBLIC_API_BASE_URL}/uploads/exercises/${exercise.slug}`}
                alt={exercise.name}
                fill
                quality={90}
                className="object-cover"
              />
              <button
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30"
                onClick={handlePlayVideo}
              >
                <div className="bg-white bg-opacity-20 rounded-full p-6">
                  <FontAwesomeIcon
                    icon={faPlay}
                    size="3x"
                    className="text-white ml-1"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal for Mobile */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
          <div className="bg-[#151515] rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-semibold">
                Full Schedule
              </h3>
              <button
                onClick={() => setScheduleModalOpen(false)}
                className="text-white hover:text-gray-300 p-2"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            <div className="bg-[#1C1C1C] p-4 rounded-lg h-96 overflow-y-auto">
              <ul className="text-sm space-y-2">
                {Array.from({ length: Math.ceil(plan.duration / 4) }).map(
                  (_, monthIndex) => (
                    <li
                      key={monthIndex}
                      className="border-b border-gray-700 pb-2"
                    >
                      <div className="font-medium text-white mb-2">
                        Month {monthIndex + 1}
                      </div>
                      <ul className="pl-4 space-y-1">
                        {Array.from({ length: 4 }).map((_, weekIndex) => (
                          <li
                            key={weekIndex}
                            className="border-b border-gray-800 pb-1"
                          >
                            <div className="text-gray-300 mb-1">
                              Week {weekIndex + 1}
                            </div>
                            <ul className="pl-4 grid grid-cols-3 gap-1">
                              {Array.from({ length: plan.daysPerWeek }).map(
                                (_, dayIndex) => {
                                  const dayId = `${monthIndex}-${weekIndex}-${dayIndex}`;
                                  return (
                                    <button
                                      key={dayIndex}
                                      className={`p-2 rounded text-xs transition-colors ${
                                        selectedDay === dayId
                                          ? "bg-customBlue text-black"
                                          : "bg-gray-700 text-white hover:bg-gray-600"
                                      }`}
                                      onClick={() => {
                                        setSelectedDay(dayId);
                                        setScheduleModalOpen(false);
                                      }}
                                    >
                                      Day {dayIndex + 1}
                                    </button>
                                  );
                                }
                              )}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
