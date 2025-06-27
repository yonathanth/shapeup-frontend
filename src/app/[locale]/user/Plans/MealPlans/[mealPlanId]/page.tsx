"use client";
import React, { useCallback, useEffect, useState } from "react";
import LoadingPage from "../../../loading";
import { MealPlanType, MealType } from "../../Meals/page";
import Image from "next/image";
import { MealCategory } from "@/src/app/[locale]/user/Plans/MealPlans/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faTarget,
  faUtensils,
  faFire,
  faCalendarDays,
  faChevronLeft,
  faChevronRight,
  faTimes,
  faExpandAlt,
  faBowlFood,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useSearchParams } from "next/navigation";

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UserMealPlanType {
  id: string;
  userId: string;
  mealPlanId: string;
  startedAt: Date;
  progress: number;
  finishedAt: Date;
}

export default function PlanDetails({
  params,
}: {
  params: { locale: string; mealPlanId: string };
}) {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [plan, setPlan] = useState<MealPlanType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(0);
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [isMealModalOpen, setMealModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealType | null>(null);
  const [doesMealPlanExist, setDoesMealPlanExist] = useState(true);
  const token = localStorage.getItem("token");

  const doesMealPlanExistForUser = useCallback(
    async (mealPlanId: string, userId: string) => {
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
        if (!userData || !Array.isArray(userData.mealPlans)) {
          throw new Error("MealPlans section not found or invalid.");
        }
        const exists = userData.mealPlans.some(
          (mealPlan: UserMealPlanType) => mealPlan.mealPlanId === mealPlanId
        );
        setDoesMealPlanExist(exists);
        return exists;
      } catch (error) {
        setDoesMealPlanExist(false);
      }
    },
    []
  );

  const selectPlan = async (mealPlanId: string) => {
    const res = await fetch(
      `${NEXT_PUBLIC_API_BASE_URL}/api/members/addUserMealPlan`,
      {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          mealPlanId: mealPlanId,
        }),
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to select plan ${res.statusText}`);
    }
    setDoesMealPlanExist(true);
  };

  const getMealPlan = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${NEXT_PUBLIC_API_BASE_URL}/api/mealPlans/${id}`,
        {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch meal plan: ${res.statusText}`);
      }
      const data = await res.json();
      setPlan(data.data.mealPlan);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await getMealPlan(params.mealPlanId);
        if (userId) {
          await doesMealPlanExistForUser(params.mealPlanId, userId);
        }
      } catch (error) {
        console.error("Error during initialization:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.mealPlanId, userId]);

  const groupedMealsByCategory = (meals: MealType[]) => {
    const grouped: Record<MealCategory, MealType[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
    };
    meals.forEach((meal: MealType) => {
      // @ts-ignore
      if (grouped[meal?.category]) {
        // @ts-ignore
        grouped[meal.category].push(meal);
      }
    });
    return grouped;
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

  const getCurrentDayMeals = () => {
    if (!selectedDay || !plan) return null;

    const [monthIndex, weekIndex, dayIndex] = selectedDay
      .split("-")
      .map(Number);
    const groupedMeals = groupedMealsByCategory(plan.meals);

    return ["breakfast", "lunch", "dinner"].map((category, index) => {
      const mealCategory = category as MealCategory;
      const meal =
        groupedMeals[mealCategory][
          dayIndex % groupedMeals[mealCategory].length
        ];
      return { category, meal, index };
    });
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
            onClick={() => getMealPlan(params.mealPlanId)}
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
          <div className="text-2xl font-bold">Meal Plan Not Found</div>
        </div>
      </div>
    );
  }

  let totalCalories = 0;
  let totalProteins = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  plan.meals.forEach((meal) => {
    totalProteins += meal.protein ? meal.protein : 0;
    totalFat += meal.fats ? meal.fats : 0;
    totalCarbs += meal.carbs ? meal.carbs : 0;
    totalCalories += meal.calories ? meal.calories : 0;
  });

  const currentDayMeals = getCurrentDayMeals();

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
                  <span className="px-3 py-1 rounded-full bg-gray-800 text-blue-400 font-medium">
                    <FontAwesomeIcon icon={faTarget} className="mr-1" />
                    {plan.mainGoal}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-800 text-purple-400 font-medium">
                    <FontAwesomeIcon icon={faUtensils} className="mr-1" />
                    Nutrition Plan
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-customBlue" />
                  <span>{plan.duration} weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faFire} className="text-customBlue" />
                  <span>{totalCalories} kcal/day</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faBowlFood}
                    className="text-customBlue"
                  />
                  <span>{plan.meals.length} meals</span>
                </div>
              </div>

              {/* Nutrition Summary */}
              <div className="bg-[#1C1C1C] p-4 rounded-lg">
                <h3 className="text-white font-medium mb-3">
                  Daily Nutrition Goals
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-customBlue font-semibold text-lg">
                      {totalProteins}g
                    </div>
                    <div className="text-gray-400">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-customBlue font-semibold text-lg">
                      {totalCarbs}g
                    </div>
                    <div className="text-gray-400">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-customBlue font-semibold text-lg">
                      {totalFat}g
                    </div>
                    <div className="text-gray-400">Fat</div>
                  </div>
                  <div className="text-center">
                    <div className="text-customBlue font-semibold text-lg">
                      {totalCalories}
                    </div>
                    <div className="text-gray-400">Calories</div>
                  </div>
                </div>
              </div>

              {!doesMealPlanExist && (
                <button
                  className="bg-customBlue text-black px-6 py-3 rounded-lg font-semibold hover:bg-customHoverBlue transition-colors mt-4"
                  onClick={async () => {
                    await selectPlan(plan.id);
                  }}
                >
                  Add to My Plans
                </button>
              )}
            </div>

            <div className="w-full lg:w-48 h-32 sm:h-40 lg:h-48 relative">
              <Image
                src={`${NEXT_PUBLIC_API_BASE_URL}/uploads/mealPlans/${plan.slug}`}
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
              Meal Schedule
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
            {Array.from({ length: 7 }).map((_, dayIndex) => {
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
          {/* Daily Meals */}
          <div className="bg-[#151515] p-4 sm:p-6 rounded-xl">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
              {selectedDay
                ? `Day ${Number(selectedDay.split("-")[2]) + 1} Meals`
                : "Select a day to view meals"}
            </h3>

            {selectedDay && currentDayMeals ? (
              <div className="space-y-4">
                {currentDayMeals.map(({ category, meal, index }) => (
                  <div
                    key={category}
                    className={`p-4 rounded-lg border-l-4 ${
                      index === 0
                        ? "border-yellow-400 bg-yellow-400/10"
                        : index === 1
                        ? "border-orange-400 bg-orange-400/10"
                        : "border-purple-400 bg-purple-400/10"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-2 capitalize">
                          {category}
                        </h4>
                        {meal ? (
                          <div>
                            <p className="text-sm text-gray-300 mb-2">
                              {meal.name}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <span>Protein: {meal.protein}g</span>
                              <span>Carbs: {meal.carbs}g</span>
                              <span>Fat: {meal.fats}g</span>
                              <span className="font-semibold text-customBlue">
                                {meal.calories} kcal
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-400 text-sm">
                            Your choice - eat whatever you like!
                          </p>
                        )}
                      </div>
                      {meal && (
                        <button
                          onClick={() => {
                            setSelectedMeal(meal);
                            setMealModalOpen(true);
                          }}
                          className="ml-4 p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                        >
                          <FontAwesomeIcon icon={faExpandAlt} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  size="2x"
                  className="mb-3"
                />
                <p>Select a day from the schedule above to view meals</p>
              </div>
            )}
          </div>

          {/* Meal Preview */}
          <div className="bg-[#151515] p-4 sm:p-6 rounded-xl">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
              Meal Preview
            </h3>

            {selectedMeal ? (
              <div className="space-y-4">
                <div className="aspect-video bg-[#1C1C1C] rounded-lg relative overflow-hidden">
                  <Image
                    src={`${NEXT_PUBLIC_API_BASE_URL}/uploads/meals/${selectedMeal.slug}`}
                    alt={selectedMeal.name}
                    fill
                    quality={90}
                    className="object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="text-white font-semibold text-lg">
                    {selectedMeal.name}
                  </h4>

                  <div className="bg-[#1C1C1C] p-4 rounded-lg">
                    <h5 className="text-white font-medium mb-3">
                      Nutrition Facts
                    </h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-customBlue font-semibold text-lg">
                          {selectedMeal.protein}g
                        </div>
                        <div className="text-gray-400">Protein</div>
                      </div>
                      <div className="text-center">
                        <div className="text-customBlue font-semibold text-lg">
                          {selectedMeal.carbs}g
                        </div>
                        <div className="text-gray-400">Carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-customBlue font-semibold text-lg">
                          {selectedMeal.fats}g
                        </div>
                        <div className="text-gray-400">Fat</div>
                      </div>
                      <div className="text-center">
                        <div className="text-customBlue font-semibold text-lg">
                          {selectedMeal.calories}
                        </div>
                        <div className="text-gray-400">Calories</div>
                      </div>
                    </div>
                  </div>

                  {selectedMeal.description && (
                    <div className="bg-[#1C1C1C] p-4 rounded-lg">
                      <h5 className="text-white font-medium mb-2">
                        Description
                      </h5>
                      <p className="text-gray-300 text-sm">
                        {selectedMeal.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <FontAwesomeIcon
                    icon={faUtensils}
                    size="3x"
                    className="mb-4"
                  />
                  <p>Select a meal to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Meal Modal for Mobile */}
      {isMealModalOpen && selectedMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-semibold">
                {selectedMeal.name}
              </h3>
              <button
                onClick={() => setMealModalOpen(false)}
                className="text-white hover:text-gray-300 p-2"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            <div className="aspect-video bg-[#1C1C1C] rounded-lg relative overflow-hidden mb-4">
              <Image
                src={`${NEXT_PUBLIC_API_BASE_URL}/uploads/meals/${selectedMeal.slug}`}
                alt={selectedMeal.name}
                fill
                quality={90}
                className="object-cover"
              />
            </div>
            <div className="bg-[#1C1C1C] p-4 rounded-lg">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-center">
                <div>
                  <div className="text-customBlue font-semibold">
                    {selectedMeal.protein}g
                  </div>
                  <div className="text-gray-400">Protein</div>
                </div>
                <div>
                  <div className="text-customBlue font-semibold">
                    {selectedMeal.carbs}g
                  </div>
                  <div className="text-gray-400">Carbs</div>
                </div>
                <div>
                  <div className="text-customBlue font-semibold">
                    {selectedMeal.fats}g
                  </div>
                  <div className="text-gray-400">Fat</div>
                </div>
                <div>
                  <div className="text-customBlue font-semibold">
                    {selectedMeal.calories}
                  </div>
                  <div className="text-gray-400">Calories</div>
                </div>
              </div>
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
                              {Array.from({ length: 7 }).map((_, dayIndex) => {
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
                              })}
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
