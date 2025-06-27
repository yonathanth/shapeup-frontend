"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";
import {
  faDumbbell,
  faUtensils,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import ExtendModal from "./ExtendModal";
import { User } from "../layout";
import { WorkoutPlanType } from "@/src/app/[locale]/user/Plans/workoutPlan/page";
import { MealType } from "@/src/app/[locale]/user/Plans/Meals/page";
import LoadingPage from "@/src/app/[locale]/user/loading";
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UserDashboardProps {
  status: string | null;
  userId: string | null;
}

const Dashboard: React.FC<UserDashboardProps> = ({ userId }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recommendedMeals, setRecommendedMeals] = useState<MealType[]>([]);
  const [todayExercises, setTodayExercises] = useState<string[]>([]);
  const [workout, setWorkout] = useState<WorkoutPlanType | null>(null);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // Get token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const getUserDetails = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(
        `${NEXT_PUBLIC_API_BASE_URL}/api/memberManagement/${userId}/profile`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          cache: "no-store",
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Authentication failed. Please login again.");
        }
        throw new Error(`Failed to fetch user details: ${res.statusText}`);
      }

      const data = await res.json();
      const userData = data?.data;

      if (userData?.workouts?.[0]?.workoutId) {
        try {
          const workoutRes = await fetch(
            `${NEXT_PUBLIC_API_BASE_URL}/api/workouts/${userData.workouts[0].workoutId}`,
            {
              method: "GET",
              headers: getAuthHeaders(),
              cache: "no-store",
            }
          );

          if (workoutRes.ok) {
            const workoutData = await workoutRes.json();
            const workoutInfo = workoutData?.data?.workout;
            setWorkout(workoutInfo);
          }
        } catch (workoutError) {
          console.error("Error fetching workout:", workoutError);
        }
      }

      setServiceId(userData?.serviceId || "");
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching user details:", err);
      return null;
    }
  }, [userId]);

  const fetchRecommendedMeals = async () => {
    try {
      setError(null);
      const res = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/api/meals`, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Authentication failed. Please login again.");
        }
        throw new Error(`Failed to fetch meals: ${res.statusText}`);
      }

      const data = await res.json();
      const meals: MealType[] = data?.data?.meals || [];

      if (meals.length > 0) {
        // Get fixed daily meals based on current date
        const today = new Date();
        const dayOfYear = Math.floor(
          (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        const startIndex = (dayOfYear * 4) % meals.length;

        const dailyMeals = [];
        for (let i = 0; i < 4; i++) {
          dailyMeals.push(meals[(startIndex + i) % meals.length]);
        }
        setRecommendedMeals(dailyMeals);
      } else {
        setRecommendedMeals([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching meals:", err);
      setRecommendedMeals([]);
    }
  };

  const fetchTodayExercises = useCallback(async () => {
    try {
      // Fetch all available exercises to show random recommendations
      const exercisesRes = await fetch(
        `${NEXT_PUBLIC_API_BASE_URL}/api/exercises`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          cache: "no-store",
        }
      );

      if (!exercisesRes.ok) {
        throw new Error(
          `Failed to fetch exercises: ${exercisesRes.statusText}`
        );
      }

      const exercisesData = await exercisesRes.json();
      const allExercises = exercisesData?.data?.exercises || [];

      if (allExercises.length > 0) {
        // Get 5 random exercises for today's recommendations
        const shuffled = [...allExercises].sort(() => 0.5 - Math.random());
        const randomExercises = shuffled.slice(0, 5);

        const exerciseNames = randomExercises.map((exercise) => exercise.name);
        setTodayExercises(exerciseNames);
      } else {
        setTodayExercises([]);
      }
    } catch (err) {
      console.error("Error fetching exercises:", err);
      // Fallback to some default exercise names if API fails
      setTodayExercises([
        "Push-ups",
        "Squats",
        "Plank",
        "Jumping Jacks",
        "Burpees",
      ]);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Check if token exists
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please login again.");
          return;
        }

        await Promise.all([
          getUserDetails(),
          fetchRecommendedMeals(),
          fetchTodayExercises(),
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadData();
    }
  }, [userId, getUserDetails, fetchTodayExercises]);

  if (isLoading) return <LoadingPage />;

  if (error) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          {error.includes("Authentication") && (
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="bg-customBlue text-black px-4 py-2 rounded-lg hover:bg-customHoverBlue hover:text-white transition-colors"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black flex flex-col h-auto min-h-screen p-6">
      {/* Header Section */}
      <header className="text-black flex flex-wrap lg:flex-nowrap gap-6 items-center mb-8">
        <div className="bg-customBlue p-8 w-full lg:w-[68%] rounded-lg">
          <h1 className="text-2xl font-light">
            Hello{" "}
            <span className="font-bold">
              {user?.fullName ? user.fullName.split(" ")[0] : "User"}
            </span>
          </h1>
          <p className="text-sm font-light mt-2">
            Welcome back! Ready to crush your fitness goals today?
          </p>
        </div>

        <div className="bg-customBlue p-8 w-full lg:w-1/3 rounded-lg relative">
          <div
            className={`absolute top-[-0.5px] right-[-0.5px] ${
              user?.status === "active" ? "bg-green-500" : "bg-red-500"
            } rounded-bl-full px-6 py-2 flex items-center justify-center border-black border-l-4 border-b-4`}
          >
            <span className="flex items-center text-black text-sm font-semibold">
              <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
              {user?.status
                ? user.status.charAt(0).toUpperCase() + user.status.slice(1)
                : "Not Found"}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <h2
              className={`text-4xl font-bold ${
                user && user.daysLeft < 5 ? "text-red-600" : ""
              }`}
            >
              {user?.daysLeft || 0}
            </h2>
            <p className="text-sm font-light">Working days left</p>
          </div>

          {user?.status === "expired" ? (
            <button
              onClick={openModal}
              className="font-light underline text-sm mt-2 block hover:text-white transition-colors"
            >
              Extend your subscription
            </button>
          ) : (
            <div className="text-sm mt-2">Glad we&apos;re family!</div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-wrap lg:flex-nowrap gap-6 text-white">
        {/* Today's Exercises Section */}
        <section className="w-full lg:w-1/2 bg-[#121212] border border-[#23363f] p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <FontAwesomeIcon
              icon={faDumbbell}
              className="text-2xl text-customBlue"
            />
            <div>
              <h3 className="text-xl font-bold">Recommended Exercises</h3>
              <p className="text-xs text-gray-400 mt-1">
                Random daily recommendations
              </p>
            </div>
          </div>

          {todayExercises.length > 0 ? (
            <div className="space-y-3">
              {todayExercises.map((exercise, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-4 px-5 bg-[#1a1a1a] border border-[#333] rounded-lg hover:border-customBlue transition-colors"
                >
                  <span className="text-sm font-medium">{exercise}</span>
                  <FontAwesomeIcon
                    icon={faCalendarCheck}
                    className="text-customBlue text-sm"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FontAwesomeIcon
                icon={faDumbbell}
                className="text-4xl text-gray-600 mb-4"
              />
              <p className="text-gray-400 mb-4">
                No exercise recommendations available
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Try refreshing to get new random exercise suggestions
              </p>
              <button
                onClick={fetchTodayExercises}
                className="bg-customBlue text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-customHoverBlue transition-colors"
              >
                Refresh Exercises
              </button>
            </div>
          )}
        </section>

        {/* Recommended Meals Section */}
        <section className="w-full lg:w-1/2 bg-[#121212] border border-[#23363f] p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <FontAwesomeIcon
              icon={faUtensils}
              className="text-2xl text-customBlue"
            />
            <h3 className="text-xl font-bold">Recommended Meals</h3>
          </div>

          {recommendedMeals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedMeals.map((meal: MealType, idx) => (
                <div
                  key={idx}
                  className="bg-[#1a1a1a] border border-[#333] p-4 rounded-lg hover:border-customBlue transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-customBlue font-medium uppercase tracking-wide">
                      {meal.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {meal.calories} kcal
                    </span>
                  </div>
                  <h4 className="font-medium text-sm mb-2 line-clamp-2">
                    {meal.name}
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {meal.description}
                  </p>
                  <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                    <span>{meal.preparationTime} min</span>
                    <span
                      className={`px-2 py-1 rounded-full ${
                        meal.vegan
                          ? "bg-green-900 text-green-400"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {meal.vegan ? "Vegan" : "Non-Vegan"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FontAwesomeIcon
                icon={faUtensils}
                className="text-4xl text-gray-600 mb-4"
              />
              <p className="text-gray-400">No meal recommendations available</p>
            </div>
          )}
        </section>
      </main>

      {/* Modal Component */}
      <ExtendModal
        user={user!}
        serviceId={serviceId}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default Dashboard;
