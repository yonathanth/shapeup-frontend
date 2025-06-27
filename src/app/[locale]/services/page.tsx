"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { faArrowUp, faCheck, faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../components/Header";
import Footer from "../components/Footer";
import servicesHeroImage from "../../../../assets/heroImages/twelve.jpg";
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ServicePlan {
  id: string;
  name: string;
  period: number;
  maxDays: number;
  price: number;
  category: string;
  gender?: string;
  description: {
    benefits: string[];
  };
  preferred: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: ServicePlan[];
}

const ServicesPage = () => {
  const [isJumping, setIsJumping] = useState(true);
  const [plans, setPlans] = useState<ServicePlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<ServicePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const nextSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToNextSection = () => {
    if (nextSectionRef.current) {
      nextSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isJumping) {
      timeoutId = setTimeout(() => {
        setIsJumping(false);
      }, 1200);
    } else {
      timeoutId = setTimeout(() => {
        setIsJumping(true);
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [isJumping]);

  // Fetch plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(
          `${NEXT_PUBLIC_API_BASE_URL}/api/services`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch plans");
        }
        const data: ApiResponse = await response.json();
        if (data.success) {
          setPlans(data.data);
          setFilteredPlans(data.data);
        } else {
          throw new Error("API returned unsuccessful response");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Filter plans based on category and gender
  useEffect(() => {
    let filtered = plans;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (plan) => plan.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedGender !== "All") {
      filtered = filtered.filter(
        (plan) =>
          (plan.gender || "unisex").toLowerCase() ===
          selectedGender.toLowerCase()
      );
    }

    setFilteredPlans(filtered);
  }, [plans, selectedCategory, selectedGender]);

  // Get unique categories and genders for filter options
  const getUniqueCategories = () => {
    const categories = plans.map((plan) => plan.category);
    return ["All", ...Array.from(new Set(categories))];
  };

  const getUniqueGenders = () => {
    const genders = plans.map((plan) => plan.gender || "unisex");
    return ["All", ...Array.from(new Set(genders))];
  };

  // Helper function to format plan name
  const formatPlanName = (name: string) => {
    return name
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .replace(/\s+/g, " ")
      .trim();
  };

  // Helper function to get period text
  const getPeriodText = (period: number) => {
    if (period === 30) return "month";
    if (period === 90) return "3 months";
    if (period === 180) return "6 months";
    return `${period} days`;
  };

  // Helper function to get plan styling based on preferred status
  const getPlanStyling = (plan: ServicePlan, index: number) => {
    if (plan.preferred) {
      return {
        bgColor:
          "bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500",
        textColor: "text-black",
        buttonColor: "bg-black",
        buttonTextColor: "text-white",
        scale: "transform scale-105",
        shadow: "shadow-2xl shadow-amber-500/30",
        border: "border-2 border-amber-400",
        crownColor: "text-amber-600",
        badgeColor: "bg-black text-amber-400",
      };
    }

    // Alternate colors for non-preferred plans
    const colorSchemes = [
      {
        bgColor: "bg-gradient-to-br from-gray-800 to-gray-900",
        textColor: "text-white",
        buttonColor: "bg-customBlue",
        buttonTextColor: "text-black",
        scale: "",
        shadow: "shadow-lg shadow-gray-900/50",
        border: "border border-gray-700",
        crownColor: "",
        badgeColor: "",
      },
      {
        bgColor: "bg-gradient-to-br from-slate-100 to-white",
        textColor: "text-black",
        buttonColor: "bg-black",
        buttonTextColor: "text-white",
        scale: "",
        shadow: "shadow-lg shadow-gray-300/50",
        border: "border border-gray-200",
        crownColor: "",
        badgeColor: "",
      },
    ];

    return colorSchemes[index % 2];
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="bg-black text-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-customBlue mx-auto mb-4"></div>
            <p className="text-xl">Loading subscription plans...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="bg-black text-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-red-400 mb-4">
              Error loading plans: {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-customBlue text-black px-6 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-black text-white scroll-container relative">
        {/* Hero Section */}
        <div
          className="relative w-full h-screen bg-fixed bg-center bg-cover"
          style={{
            backgroundImage: `url(${servicesHeroImage.src})`,
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-white text-center mb-8"
            >
              Membership Plans
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-base md:text-xl text-white/90 max-w-xs md:max-w-2xl text-center mb-12"
            >
              Choose a membership plan that fits your fitness goals and
              lifestyle
            </motion.p>
            <motion.div
              onClick={scrollToNextSection}
              className="border-2 border-white/50 rounded-full p-3 cursor-pointer hover:border-customBlue transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={isJumping ? { y: [0, -15, 0] } : {}}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
                repeat: isJumping ? Infinity : 0,
              }}
            >
              <FontAwesomeIcon
                icon={faArrowUp}
                className="text-white text-xl rotate-180 hover:text-customBlue transition-colors"
              />
            </motion.div>
          </div>
        </div>

        {/* Main Content Section */}
        <div ref={nextSectionRef} className="relative z-10 bg-black">
          {/* Pricing Plans Header */}
          <section className="pt-20 pb-10 px-4 md:px-8 lg:px-16">
            <div className="max-w-6xl mx-auto text-center">
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                Right Plan for your
                <br />
                <span className="text-customBlue">fitness journey</span>
              </motion.h2>
              <motion.p
                className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Join Shape Up Gym & Fitness with flexible membership options
                designed for every fitness level and budget.
              </motion.p>
            </div>
          </section>

          {/* Filter Section */}
          <section className="pb-10 px-4 md:px-8 lg:px-16">
            <div className="max-w-6xl mx-auto">
              {/* Simple and subtle filter bar */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8 py-6 border-b border-gray-800">
                {/* Filter Label */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm font-medium">
                    Filter by:
                  </span>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Category Filter */}
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="
                        appearance-none bg-transparent border border-gray-700 
                        text-white text-sm rounded-lg px-4 py-2 pr-8
                        focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue
                        transition-all duration-200 hover:border-gray-600
                        cursor-pointer min-w-[120px]
                      "
                    >
                      {getUniqueCategories().map((category) => (
                        <option
                          key={category}
                          value={category}
                          className="bg-gray-800 text-white"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Gender Filter */}
                  <div className="relative">
                    <select
                      value={selectedGender}
                      onChange={(e) => setSelectedGender(e.target.value)}
                      className="
                        appearance-none bg-transparent border border-gray-700 
                        text-white text-sm rounded-lg px-4 py-2 pr-8
                        focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue
                        transition-all duration-200 hover:border-gray-600
                        cursor-pointer min-w-[120px]
                      "
                    >
                      {getUniqueGenders().map((gender) => (
                        <option
                          key={gender}
                          value={gender}
                          className="bg-gray-800 text-white"
                        >
                          {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  {(selectedCategory !== "All" || selectedGender !== "All") && (
                    <button
                      onClick={() => {
                        setSelectedCategory("All");
                        setSelectedGender("All");
                      }}
                      className="
                        text-gray-400 hover:text-white text-sm underline 
                        underline-offset-4 decoration-1 hover:decoration-2
                        transition-all duration-200 px-2 py-2
                      "
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                {/* Results Count */}
                <div className="text-gray-500 text-xs">
                  {filteredPlans.length} service
                  {filteredPlans.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Plans Section */}
          <section className="pb-20 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredPlans.length > 0 ? (
                  filteredPlans.map((plan, index) => {
                    const styling = getPlanStyling(plan, index);
                    return (
                      <motion.div
                        key={plan.id}
                        className={`
                        ${styling.bgColor} ${styling.textColor} ${styling.border}
                        rounded-2xl p-6 relative ${styling.scale} ${styling.shadow}
                        transition-all duration-300 hover:scale-105 hover:shadow-xl
                        flex flex-col h-full
                      `}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        {plan.preferred && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <span
                              className={`${styling.badgeColor} px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg`}
                            >
                              RECOMMENDED
                            </span>
                          </div>
                        )}

                        <div className="text-center mb-6">
                          <h3 className="text-lg font-bold mb-3 leading-tight">
                            {formatPlanName(plan.name)}
                          </h3>
                          <div className="mb-4">
                            <span className="text-3xl font-bold">
                              ETB {plan.price.toLocaleString()}
                            </span>
                            <span className="text-sm ml-1 opacity-75">
                              / {getPeriodText(plan.period)}
                            </span>
                          </div>
                          <div className="text-xs opacity-75 space-x-4">
                            <span>Category: {plan.category}</span>
                            {plan.gender && plan.gender !== "unisex" && (
                              <span>
                                • Target:{" "}
                                {plan.gender.charAt(0).toUpperCase() +
                                  plan.gender.slice(1)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex-grow">
                          {plan.description.benefits &&
                            plan.description.benefits.length > 0 &&
                            plan.description.benefits[0] !== "" && (
                              <div className="space-y-3 mb-6">
                                {plan.description.benefits.map(
                                  (benefit, benefitIndex) =>
                                    benefit &&
                                    benefit.trim() !== "" && (
                                      <div
                                        key={benefitIndex}
                                        className="flex items-start gap-3"
                                      >
                                        <FontAwesomeIcon
                                          icon={faCheck}
                                          className={`text-sm mt-1 flex-shrink-0 ${
                                            plan.preferred
                                              ? "text-yellow-400"
                                              : "text-green-400"
                                          }`}
                                        />
                                        <span className="text-sm leading-relaxed">
                                          {benefit}
                                        </span>
                                      </div>
                                    )
                                )}
                              </div>
                            )}
                        </div>

                        <div className="mt-auto">
                          <Link
                            href={`/en/Register?planId=${
                              plan.id
                            }&planName=${encodeURIComponent(
                              plan.name
                            )}&planPrice=${
                              plan.price
                            }&planCategory=${encodeURIComponent(
                              plan.category
                            )}`}
                          >
                            <button
                              className={`
                              w-full ${styling.buttonColor} ${
                                styling.buttonTextColor
                              } 
                              py-3 px-6 rounded-lg font-semibold text-sm
                              transition-all duration-300 hover:scale-105 hover:shadow-lg
                              ${
                                plan.preferred
                                  ? "hover:bg-gray-800"
                                  : "hover:opacity-90"
                              }
                            `}
                            >
                              Choose Plan
                            </button>
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400 text-lg mb-4">
                      No services found matching your criteria
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory("All");
                        setSelectedGender("All");
                      }}
                      className="bg-customBlue text-black px-6 py-2 rounded-lg hover:bg-blue-400 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="pb-20 px-4 md:px-8 lg:px-16">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                  Ready to start your fitness journey? Join Shape Up Gym &
                  Fitness in Sarbet, Addis Ababa and experience quality
                  facilities with experienced trainers.
                </p>
                <Link href="/en/Register">
                  <button className="border-2 border-customBlue text-customBlue hover:bg-customBlue hover:text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                    Start Your Journey Today!
                  </button>
                </Link>
              </motion.div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ServicesPage;
