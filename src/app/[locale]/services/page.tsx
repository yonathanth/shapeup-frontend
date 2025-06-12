"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../components/Header";
import Footer from "../components/Footer";
import servicesHeroImage from "../../../../assets/images/services_hero.jpg";

const ServicesPage = () => {
  const [isJumping, setIsJumping] = useState(true);
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

  const plans = [
    {
      id: "basic",
      name: "BASIC PLAN",
      price: "ETB 19.99",
      period: "month",
      features: [
        "Access to gym equipment",
        "Basic workout plans",
        "Locker room access",
        "One guest pass per month",
      ],
      bgColor: "bg-gray-200",
      textColor: "text-black",
      buttonColor: "bg-customBlue",
      buttonTextColor: "text-black",
      checkIcon: "✓",
      popular: false,
    },
    {
      id: "pro",
      name: "PRO PLAN",
      price: "ETB 19.99",
      period: "month",
      features: [
        "All Basic Plan features",
        "Group fitness classes",
        "Personal trainer consultation",
        "Nutrition guidance",
      ],
      bgColor: "bg-customBlue",
      textColor: "text-black",
      buttonColor: "bg-black",
      buttonTextColor: "text-white",
      checkIcon: "//",
      popular: true,
    },
    {
      id: "elite",
      name: "ELITE PLAN",
      price: "ETB 19.99",
      period: "month",
      features: [
        "All Pro Plan features",
        "Unlimited personal training",
        "Priority booking",
        "Exclusive member events",
      ],
      bgColor: "bg-white",
      textColor: "text-black",
      buttonColor: "bg-customBlue",
      buttonTextColor: "text-black",
      checkIcon: "//",
      popular: false,
    },
  ];

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
              Our Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-base md:text-xl text-white/90 max-w-xs md:max-w-2xl text-center mb-12"
            >
              Choose the perfect plan that fits your fitness goals and lifestyle
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
                Perfect Plan for your
                <br />
                <span className="text-customBlue">fitness goals</span>
              </motion.h2>
              <motion.p
                className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Choose the membership plan that fits your lifestyle and fitness
                objectives. Start your transformation journey today with our
                expert guidance.
              </motion.p>
            </div>
          </section>

          {/* Pricing Plans Section */}
          <section className="pb-20 px-4 md:px-8 lg:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    className={`
                      ${plan.bgColor} ${plan.textColor} 
                      rounded-2xl p-8 relative
                      ${
                        plan.popular
                          ? "transform scale-105 shadow-2xl"
                          : "shadow-lg"
                      }
                      transition-all duration-300 hover:scale-105
                    `}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-black text-white px-4 py-2 rounded-full text-sm font-semibold">
                          MOST POPULAR
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-8">
                      <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
                      <div className="mb-6">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        <span className="text-sm ml-1">/ {plan.period}</span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          <span className="font-bold text-lg mt-1 flex-shrink-0">
                            {plan.checkIcon}
                          </span>
                          <span className="text-sm leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Link href="/Register">
                      <button
                        className={`
                          w-full ${plan.buttonColor} ${plan.buttonTextColor} 
                          py-3 px-6 rounded-lg font-semibold text-sm
                          transition-all duration-300 hover:scale-105 hover:shadow-lg
                        `}
                      >
                        Join Now
                      </button>
                    </Link>
                  </motion.div>
                ))}
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
                  Ready to transform your life? Join thousands of members who
                  have achieved their fitness goals with our comprehensive
                  training programs and supportive community.
                </p>
                <Link href="/Register">
                  <button className="border-2 border-customBlue text-customBlue hover:bg-customBlue hover:text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                    Join Us Now!
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
