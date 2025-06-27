"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faLeaf,
  faFire,
  faTimes,
  faUtensils,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface MealPlanType {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  mainGoal: string;
  duration: number;
  meals: {
    id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    ingredients: {
      id: string;
      name: string;
      quantity: string;
    }[];
    instructions: string;
    calories?: number;
    vegan: boolean;
    preparationTime: number;
    protein?: number;
    carbs?: number;
    fats?: number;
  }[];
}

export interface MealType {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  ingredients: {
    id: string;
    name: string;
    quantity: string;
  }[];
  instructions: string;
  calories?: number;
  vegan: boolean;
  preparationTime: number;
  protein?: number;
  carbs?: number;
  fats?: number;
}

interface MealListProps {
  meals: MealType[];
  className?: string;
}

const MealList: React.FC<MealListProps> = ({ meals, className }) => {
  const [selectedMeal, setSelectedMeal] = useState<MealType | null>(null);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredMeals: MealType[] =
    filter === "All"
      ? meals
      : meals.filter((meal) =>
          filter === "breakfast"
            ? meal.category.toLowerCase().includes("breakfast")
            : filter === "lunch"
            ? meal.category.toLowerCase().includes("lunch")
            : filter === "dinner"
            ? meal.category.toLowerCase().includes("dinner")
            : filter === "snack"
            ? meal.category.toLowerCase().includes("snack")
            : filter === "other"
            ? meal.category.toLowerCase().includes("other")
            : false
        );

  useEffect(() => {
    if (filteredMeals.length > 0 && !selectedMeal) {
      setSelectedMeal(filteredMeals[0]);
    }
  }, [filteredMeals, selectedMeal]);

  const handleMealClick = (meal: MealType) => {
    setSelectedMeal(meal);
    setShowModal(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "breakfast":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "lunch":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "dinner":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "snack":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const filterCategories = [
    "All",
    "breakfast",
    "lunch",
    "dinner",
    "snack",
    "other",
  ];

  return (
    <div className="min-h-screen bg-black p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-[#151515] to-[#252525] p-4 sm:p-6 rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Meal Library
                </h1>
                <p className="text-gray-400 mt-1">
                  Explore our collection of {meals.length} nutritious meals
                </p>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="md:hidden bg-customBlue text-black px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faFilter} />
                Filter ({filter})
              </button>
            </div>

            {/* Desktop Filters */}
            <div className="hidden md:flex mt-4 gap-2 flex-wrap">
              {filterCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === category
                      ? "bg-customBlue text-black"
                      : "bg-[#1C1C1C] text-gray-300 hover:bg-[#2A2A2A] hover:text-white"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Mobile Filters Dropdown */}
            {showMobileFilters && (
              <div className="md:hidden mt-4 bg-[#1C1C1C] rounded-lg p-2">
                <div className="grid grid-cols-2 gap-2">
                  {filterCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setFilter(category);
                        setShowMobileFilters(false);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        filter === category
                          ? "bg-customBlue text-black"
                          : "bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]"
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Meals List */}
          <div className="bg-[#151515] rounded-xl p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Available Meals ({filteredMeals.length})
            </h2>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              {filteredMeals.map((meal) => (
                <div
                  key={meal.slug}
                  onClick={() => handleMealClick(meal)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                    selectedMeal?.slug === meal.slug
                      ? "bg-customBlue/10 border-customBlue"
                      : "bg-[#1C1C1C] border-transparent hover:bg-[#252525] hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={`${NEXT_PUBLIC_API_BASE_URL}/uploads/meals/${meal.slug}`}
                        alt={meal.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-white text-sm truncate pr-2">
                          {meal.name}
                        </h3>
                        <div className="flex-shrink-0">
                          <span className="bg-customBlue text-black px-2 py-1 rounded text-xs font-bold">
                            {meal.calories || 0} cal
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span
                          className={`px-2 py-1 rounded border text-xs ${getCategoryColor(
                            meal.category
                          )}`}
                        >
                          {meal.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faClock} />
                          {meal.preparationTime}min
                        </div>
                        {meal.vegan && (
                          <div className="flex items-center gap-1 text-green-400">
                            <FontAwesomeIcon icon={faLeaf} />
                            Vegan
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meal Details */}
          <div className="bg-[#151515] rounded-xl p-4 sm:p-6">
            {selectedMeal ? (
              <div className="space-y-6">
                <div className="relative w-full h-48 sm:h-60 rounded-lg overflow-hidden">
                  <Image
                    src={`${NEXT_PUBLIC_API_BASE_URL}/uploads/meals/${selectedMeal.slug}`}
                    alt={selectedMeal.name}
                    width={500}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      {selectedMeal.name}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-lg border text-sm ${getCategoryColor(
                        selectedMeal.category
                      )}`}
                    >
                      {selectedMeal.category}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {selectedMeal.description}
                  </p>
                </div>

                {/* Nutritional Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#1C1C1C] p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-customBlue">
                      {selectedMeal.calories || 0}
                    </div>
                    <div className="text-xs text-gray-400">Calories</div>
                  </div>
                  <div className="bg-[#1C1C1C] p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-red-400">
                      {selectedMeal.protein || 0}g
                    </div>
                    <div className="text-xs text-gray-400">Protein</div>
                  </div>
                  <div className="bg-[#1C1C1C] p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-yellow-400">
                      {selectedMeal.carbs || 0}g
                    </div>
                    <div className="text-xs text-gray-400">Carbs</div>
                  </div>
                  <div className="bg-[#1C1C1C] p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-green-400">
                      {selectedMeal.fats || 0}g
                    </div>
                    <div className="text-xs text-gray-400">Fats</div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faClock}
                      className="text-customBlue"
                    />
                    {selectedMeal.preparationTime} minutes
                  </div>
                  {selectedMeal.vegan && (
                    <div className="flex items-center gap-2 text-green-400">
                      <FontAwesomeIcon icon={faLeaf} />
                      Vegan-friendly
                    </div>
                  )}
                </div>

                {/* Ingredients */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Ingredients
                  </h3>
                  <div className="bg-[#1C1C1C] p-4 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedMeal.ingredients.map((ingredient, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-300">
                            {ingredient.name}
                          </span>
                          <span className="text-customBlue">
                            {ingredient.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <FontAwesomeIcon
                  icon={faUtensils}
                  className="text-6xl text-gray-600 mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  Select a Meal
                </h3>
                <p className="text-gray-500">
                  Choose a meal from the list to view details
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 lg:hidden p-4">
            <div className="bg-[#151515] rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[#151515] p-4 border-b border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Meal Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-[#252525] rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-gray-400" />
                </button>
              </div>

              {selectedMeal && (
                <div className="p-4 space-y-4">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={`${NEXT_PUBLIC_API_BASE_URL}/uploads/meals/${selectedMeal.slug}`}
                      alt={selectedMeal.name}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {selectedMeal.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded border text-xs ${getCategoryColor(
                          selectedMeal.category
                        )}`}
                      >
                        {selectedMeal.category}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {selectedMeal.description}
                    </p>
                  </div>

                  {/* Mobile Nutritional Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#1C1C1C] p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-customBlue">
                        {selectedMeal.calories || 0}
                      </div>
                      <div className="text-xs text-gray-400">Calories</div>
                    </div>
                    <div className="bg-[#1C1C1C] p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-red-400">
                        {selectedMeal.protein || 0}g
                      </div>
                      <div className="text-xs text-gray-400">Protein</div>
                    </div>
                    <div className="bg-[#1C1C1C] p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-yellow-400">
                        {selectedMeal.carbs || 0}g
                      </div>
                      <div className="text-xs text-gray-400">Carbs</div>
                    </div>
                    <div className="bg-[#1C1C1C] p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-green-400">
                        {selectedMeal.fats || 0}g
                      </div>
                      <div className="text-xs text-gray-400">Fats</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="text-customBlue"
                      />
                      {selectedMeal.preparationTime}min
                    </div>
                    {selectedMeal.vegan && (
                      <div className="flex items-center gap-2 text-green-400">
                        <FontAwesomeIcon icon={faLeaf} />
                        Vegan
                      </div>
                    )}
                  </div>

                  {/* Mobile Ingredients */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">
                      Ingredients
                    </h4>
                    <div className="bg-[#1C1C1C] p-3 rounded-lg">
                      <div className="space-y-2">
                        {selectedMeal.ingredients.map((ingredient, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-300">
                              {ingredient.name}
                            </span>
                            <span className="text-customBlue">
                              {ingredient.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealList;
