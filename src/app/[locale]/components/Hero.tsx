"use client";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import heroImage from "@/assets/images/hero.jpeg";
import { useEffect, useRef, useState } from "react";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const [isHovering, setIsHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const cards = [
    {
      id: 1,
      content: (
        <>
          <div className="flex items-center mb-4 gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 md:w-16 md:h-16 rounded-full border-2 border-white"
                >
                  <Image
                    src={heroImage}
                    alt={`user${i}`}
                    width={64}
                    height={64}
                    className="rounded-full w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold">200+</p>
              <p className="text-xs md:text-sm">Members</p>
            </div>
          </div>
          <p className="text-xs md:text-sm">
            Be part of a supportive network that motivates you to smash every
            goal.
          </p>
        </>
      ),
      bg: "bg-white",
      text: "text-black",
    },
    {
      id: 2,
      content: (
        <>
          <p className="mb-4 text-sm md:text-base font-bold">
            From aerobics to strength training and futsal, we offer diverse
            workouts—all with fresh-air energy!
          </p>
          <hr className="border-white/50 my-2" />
          <p className="text-xs md:text-sm font-semibold flex items-center">
            Explore Our Services{" "}
            <Link href="/services" className="ml-1">
              →
            </Link>
          </p>
        </>
      ),
      bg: "bg-[#303030]",
      text: "text-white",
    },
    {
      id: 3,
      content: (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base md:text-lg font-semibold">
              Got Questions?
            </h2>
            <button
              type="submit"
              className="bg-black text-white p-1 md:p-2 rounded-full transition hover:scale-105"
            >
              <FaArrowRight className="text-lg md:text-xl -rotate-45 scale-x-125" />
            </button>
          </div>
          <p className="text-xs md:text-sm">
            From membership plans to class schedules, our FAQ page covers it
            all. Dive in and find what you need to kickstart your journey!
          </p>
        </>
      ),
      bg: "bg-customBlue",
      text: "text-black",
    },
  ];

  // Create extended cards array for infinite scroll (add first card at the end)
  const extendedCards = [...cards, cards[0]];

  // Auto-scroll functionality with infinite loop
  useEffect(() => {
    if (isHovering || isTransitioning) return;

    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => {
          if (prev === cards.length - 1) {
            // When reaching the last real card, move to the duplicate first card
            return cards.length;
          }
          return prev + 1;
        });
      }, 3000);
    };

    startAutoScroll();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cards.length, isHovering, isTransitioning]);

  // Handle scroll when currentSlide changes with infinite loop logic
  useEffect(() => {
    if (!sliderRef.current) return;

    const cardWidth = sliderRef.current.clientWidth;

    if (currentSlide === cards.length) {
      // We're at the duplicate first card, scroll to it with transition
      setIsTransitioning(true);
      sliderRef.current.scrollTo({
        left: currentSlide * cardWidth,
        behavior: "smooth",
      });

      // After transition completes, jump to the real first card without animation
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.scrollTo({
            left: 0,
            behavior: "auto", // No animation for the jump
          });
          setCurrentSlide(0);
          setIsTransitioning(false);
        }
      }, 500); // Match this with CSS transition duration
    } else {
      // Normal scroll behavior
      sliderRef.current.scrollTo({
        left: currentSlide * cardWidth,
        behavior: "smooth",
      });
    }
  }, [currentSlide, cards.length]);

  return (
    <section
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage.src})` }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-0"></div>

      {/* Hero Content - Pushed higher up on screen */}
      <div
        className="absolute inset-0 z-10 flex items-center"
        style={{ transform: "translateY(-10vh)" }}
      >
        <div className="w-full px-6 md:px-20">
          <div className="max-w-2xl text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Shape Up Fitness Center
            </h1>
            <p className="text-sm md:text-base lg:text-lg mb-8 md:mb-10">
              Achieve your fitness goals with expert guidance, flexible plans,
              and real results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/join">
                <button className="bg-customBlue hover:bg-customHoverBlue text-black px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-medium">
                  Register
                </button>
              </Link>
              <Link href="/about">
                <button className="bg-[#232323] hover:bg-[#333333] rounded-lg text-white px-6 py-3 transition-all duration-300 border border-white/10 hover:border-white/30 font-medium">
                  More about ShapeUp
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Cards Section - Positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 w-full pb-6 md:pb-10 px-4 md:px-20">
        {/* Desktop View (3 columns) */}
        <div className="hidden md:flex justify-between gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`flex-1 ${card.bg} ${card.text} p-8 rounded-xl transition-all hover:scale-[1.02] shadow-lg`}
            >
              {card.content}
            </div>
          ))}
        </div>

        {/* Mobile View - Infinite scroll */}
        <div
          className="md:hidden w-full"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            ref={sliderRef}
            className="flex overflow-x-hidden snap-x snap-mandatory"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {extendedCards.map((card, index) => (
              <div
                key={`${card.id}-${index}`}
                className={`flex-shrink-0 w-full ${card.bg} ${card.text} p-6 rounded-xl shadow-lg transition-transform duration-500 ease-in-out`}
                style={{ scrollSnapAlign: "start" }}
              >
                {card.content}
              </div>
            ))}
          </div>

          {/* Dots indicator for mobile */}
          <div className="flex justify-center mt-4 gap-2">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isTransitioning) {
                    setCurrentSlide(index);
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide % cards.length
                    ? "bg-white"
                    : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
