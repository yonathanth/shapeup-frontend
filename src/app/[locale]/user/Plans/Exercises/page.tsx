"use client";
import React, { useEffect, useRef, useState } from "react";
import { ExerciseType } from "../workoutPlan/[workoutPlanId]/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faTimes,
  faExpandAlt,
  faDumbbell,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import LoadingPage from "@/src/app/[locale]/user/loading";

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ExerciseListProps {
  exercises: ExerciseType[];
  className?: string;
}

const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  className,
}) => {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType | null>(
    null
  );
  const [filter, setFilter] = useState("all");
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isYouTubeLoaderReady, setIsYouTubeLoaderReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoModalOpen, setVideoModalOpen] = useState(false);

  const filteredExercises =
    filter === "all"
      ? exercises
      : exercises.filter((exercise: ExerciseType) =>
          exercise.focusArea.toLowerCase().includes(filter)
        );

  useEffect(() => {
    if (filteredExercises.length > 0 && !selectedExercise) {
      setSelectedExercise(filteredExercises[0]);
    }
  }, [filteredExercises]);

  const handleExerciseClick = (exercise: ExerciseType) => {
    setIsLoading(true);
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
    setIsPlaying(false);
    setSelectedExercise(exercise || null);
    setIsLoading(false);
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

  const handlePlayVideo = () => {
    const videoId = selectedExercise?.videoUrl;
    //@ts-ignore
    if (isYouTubeLoaderReady && window.YT && videoId) {
      initializePlayer(videoId);
    } else {
      console.log("YouTube Player not ready or missing video URL");
    }
  };

  const handleMobileVideoClick = () => {
    setVideoModalOpen(true);
  };

  if (isLoading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-black p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#1e1e1e] text-white rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-700">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4">
              Exercise Library
            </h1>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {[
                "All",
                "Chest",
                "Back",
                "Legs",
                "Arms",
                "Core",
                "Shoulders",
                "FullBody",
                "Other",
                "UpperBody",
                "LowerBody",
              ].map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category.toLowerCase())}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-full transition-colors ${
                    filter === category.toLowerCase()
                      ? "bg-customBlue text-black font-semibold"
                      : "bg-[#2a2a2a] text-white hover:bg-[#555555]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* Exercise List */}
            <div className="p-4 sm:p-6 border-r border-gray-700">
              <h2 className="text-lg font-semibold mb-4">
                Exercises ({filteredExercises.length})
              </h2>

              <div className="space-y-2 h-96 lg:h-[500px] overflow-y-auto pr-2">
                {filteredExercises.map((exercise) => (
                  <button
                    key={exercise.slug}
                    onClick={() => handleExerciseClick(exercise)}
                    className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-lg transition-all duration-200 ${
                      selectedExercise?.slug === exercise.slug
                        ? "bg-customBlue text-black"
                        : "bg-[#2a2a2a] hover:bg-[#333333] text-white"
                    }`}
                  >
                    <div className="flex-1 text-left">
                      <h3 className="text-sm sm:text-base font-medium">
                        {exercise.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs opacity-75">
                        <span>{exercise.focusArea}</span>
                        <span>•</span>
                        <span>
                          {exercise.sets} sets × {exercise.reps} reps
                        </span>
                      </div>
                    </div>
                    <FontAwesomeIcon
                      icon={faPlay}
                      className={`ml-3 ${
                        selectedExercise?.slug === exercise.slug
                          ? "text-black"
                          : "text-customBlue"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise Preview */}
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {selectedExercise
                    ? selectedExercise.name
                    : "Exercise Preview"}
                </h2>
                {selectedExercise && (
                  <button
                    onClick={handleMobileVideoClick}
                    className="lg:hidden p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                  >
                    <FontAwesomeIcon icon={faExpandAlt} />
                  </button>
                )}
              </div>

              {selectedExercise ? (
                <div className="space-y-4">
                  {/* Video/Image Container - Hidden on mobile, shown on desktop */}
                  <div className="hidden lg:block">
                    <div className="aspect-video bg-[#1C1C1C] rounded-lg relative overflow-hidden">
                      {!isPlaying && (
                        <>
                          <Image
                            src={`${NEXT_PUBLIC_API_BASE_URL}/uploads/exercises/${selectedExercise.slug}`}
                            alt={selectedExercise.name}
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
                    </div>
                  </div>

                  {/* Mobile Preview Image */}
                  <div className="lg:hidden">
                    <div className="aspect-video bg-[#1C1C1C] rounded-lg relative overflow-hidden">
                      <Image
                        src={`${NEXT_PUBLIC_API_BASE_URL}/uploads/exercises/${selectedExercise.slug}`}
                        alt={selectedExercise.name}
                        fill
                        quality={90}
                        className="object-cover"
                      />
                      <button
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30"
                        onClick={handleMobileVideoClick}
                      >
                        <div className="bg-white bg-opacity-20 rounded-full p-4">
                          <FontAwesomeIcon
                            icon={faPlay}
                            size="2x"
                            className="text-white ml-1"
                          />
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Exercise Details */}
                  <div className="space-y-4">
                    <div className="bg-[#2a2a2a] p-4 rounded-lg">
                      <h3 className="text-white font-medium mb-3">
                        Exercise Details
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-customBlue font-semibold text-lg">
                            {selectedExercise.sets}
                          </div>
                          <div className="text-gray-400">Sets</div>
                        </div>
                        <div className="text-center">
                          <div className="text-customBlue font-semibold text-lg">
                            {selectedExercise.reps}
                          </div>
                          <div className="text-gray-400">Reps</div>
                        </div>
                        <div className="text-center">
                          <div className="text-customBlue font-semibold text-lg">
                            {selectedExercise.duration}s
                          </div>
                          <div className="text-gray-400">Duration</div>
                        </div>
                        <div className="text-center">
                          <div className="text-customBlue font-semibold text-sm">
                            {selectedExercise.focusArea}
                          </div>
                          <div className="text-gray-400">Focus Area</div>
                        </div>
                      </div>
                    </div>

                    {selectedExercise.description && (
                      <div className="bg-[#2a2a2a] p-4 rounded-lg">
                        <h3 className="text-white font-medium mb-2">
                          Description
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {selectedExercise.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  <div className="text-center">
                    <FontAwesomeIcon
                      icon={faDumbbell}
                      size="3x"
                      className="mb-4"
                    />
                    <p>Select an exercise from the list to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal for Mobile */}
      {isVideoModalOpen && selectedExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-semibold">
                {selectedExercise.name}
              </h3>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="text-white hover:text-gray-300 p-2"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>

            <div className="aspect-video bg-[#1C1C1C] rounded-lg relative overflow-hidden mb-4">
              {!isPlaying && (
                <>
                  <Image
                    src={`${NEXT_PUBLIC_API_BASE_URL}/uploads/exercises/${selectedExercise.slug}`}
                    alt={selectedExercise.name}
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
                </>
              )}
              <div ref={videoRef} className="absolute inset-0 w-full h-full" />
            </div>

            {/* Exercise info in modal */}
            <div className="bg-[#2a2a2a] p-4 rounded-lg">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-center">
                <div>
                  <div className="text-customBlue font-semibold">
                    {selectedExercise.sets}
                  </div>
                  <div className="text-gray-400">Sets</div>
                </div>
                <div>
                  <div className="text-customBlue font-semibold">
                    {selectedExercise.reps}
                  </div>
                  <div className="text-gray-400">Reps</div>
                </div>
                <div>
                  <div className="text-customBlue font-semibold">
                    {selectedExercise.duration}s
                  </div>
                  <div className="text-gray-400">Duration</div>
                </div>
                <div>
                  <div className="text-customBlue font-semibold text-sm">
                    {selectedExercise.focusArea}
                  </div>
                  <div className="text-gray-400">Focus Area</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseList;
