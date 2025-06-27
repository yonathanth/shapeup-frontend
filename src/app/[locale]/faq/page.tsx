"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FaPlus,
  FaMinus,
  FaQuestionCircle,
  FaDumbbell,
  FaCreditCard,
  FaClock,
} from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import heroImage from "../../../../assets/heroImages/eight.jpg";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: "general" | "membership" | "training" | "facilities";
}

const FAQPage = () => {
  const [isJumping, setIsJumping] = useState(true);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
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

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const categories = [
    { id: "all", name: "All Questions", icon: FaQuestionCircle },
    { id: "membership", name: "Membership", icon: FaCreditCard },
    { id: "training", name: "Training", icon: FaDumbbell },
    { id: "facilities", name: "Facilities", icon: FaClock },
  ];

  const faqData: FAQItem[] = [
    {
      id: 1,
      category: "membership",
      question: "What membership plans do you offer?",
      answer:
        "We offer three main membership plans: Basic Plan (ETB 19.99/month) with access to gym equipment and basic workout plans, Pro Plan (ETB 19.99/month) which includes group fitness classes and personal trainer consultations, and Elite Plan (ETB 19.99/month) featuring unlimited personal training and priority booking.",
    },
    {
      id: 2,
      category: "membership",
      question: "Can I cancel my membership anytime?",
      answer:
        "Yes, you can cancel your membership with a 30-day notice. We require written notice either in person at our facility or via email. There are no cancellation fees for monthly memberships.",
    },
    {
      id: 3,
      category: "membership",
      question: "Do you offer family discounts?",
      answer:
        "Yes! We offer family packages with up to 20% discount for families with 3 or more members. Contact our membership team for detailed pricing and eligibility requirements.",
    },
    {
      id: 4,
      category: "training",
      question: "Do I need experience to join group fitness classes?",
      answer:
        "Not at all! Our group fitness classes are designed for all fitness levels. Our certified instructors will modify exercises to match your current fitness level and help you progress safely.",
    },
    {
      id: 5,
      category: "training",
      question: "How often should I work out as a beginner?",
      answer:
        "For beginners, we recommend starting with 3-4 workouts per week, allowing rest days between sessions. Our personal trainers can create a customized schedule based on your goals and current fitness level.",
    },
    {
      id: 6,
      category: "training",
      question: "What is included in personal training sessions?",
      answer:
        "Personal training sessions include fitness assessment, customized workout plans, proper form instruction, progress tracking, and nutrition guidance. Sessions are typically 60 minutes and can be scheduled based on your availability.",
    },
    {
      id: 7,
      category: "facilities",
      question: "What are your operating hours?",
      answer:
        "We are open Monday through Friday from 6:00 AM to 10:00 PM, and weekends (Saturday and Sunday) from 7:00 AM to 9:00 PM. We also offer 24/7 access for Elite members.",
    },
    {
      id: 8,
      category: "facilities",
      question: "Do you provide locker rooms and showers?",
      answer:
        "Yes, we have fully equipped locker rooms with showers, changing areas, and complimentary towels. All lockers are secured and available for day-use or long-term rental.",
    },
    {
      id: 9,
      category: "facilities",
      question: "Is parking available?",
      answer:
        "Yes, we provide free parking for all members. We have a secure parking area with CCTV surveillance located directly adjacent to our facility.",
    },
    {
      id: 10,
      category: "general",
      question: "Do I need to bring my own equipment?",
      answer:
        "No, we provide all necessary equipment including weights, cardio machines, mats, and small accessories. You only need to bring a water bottle, towel, and workout clothes.",
    },
    {
      id: 11,
      category: "general",
      question: "Do you offer nutrition counseling?",
      answer:
        "Yes, our Pro and Elite plans include nutrition guidance. We also have certified nutritionists available for specialized meal planning and dietary consultations at additional cost.",
    },
    {
      id: 12,
      category: "general",
      question: "Can I freeze my membership temporarily?",
      answer:
        "Yes, you can freeze your membership for up to 3 months per year for medical reasons or extended travel. A freeze fee of ETB 5.00 per month applies to maintain your membership rate.",
    },
  ];

  const filteredFAQs =
    activeCategory === "all"
      ? faqData
      : faqData.filter((faq) => faq.category === activeCategory);

  return (
    <>
      <Header />
      <div className="bg-black text-white scroll-container relative">
        {/* Hero Section */}
        <div
          className="relative w-full h-screen bg-fixed bg-center bg-cover"
          style={{
            backgroundImage: `url(${heroImage.src})`,
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
              FAQ
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-base md:text-xl text-white/90 max-w-xs md:max-w-2xl text-center mb-12"
            >
              Find answers to the most commonly asked questions about our gym,
              memberships, and services
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
          {/* FAQ Header */}
          <section className="pt-20 pb-10 px-4 md:px-8 lg:px-16">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                Frequently Asked{" "}
                <span className="text-customBlue">Questions</span>
              </motion.h2>
              <motion.p
                className="text-gray-400 text-lg max-w-2xl mx-auto mb-4 sm:mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Can't find what you're looking for? Feel free to contact us and
                we'll be happy to help.
              </motion.p>
            </div>
          </section>

          {/* Category Filter */}
          <section className="pb-10 px-4 md:px-8 lg:px-16">
            <div className="max-w-4xl mx-auto">
              <motion.div
                className="flex flex-wrap justify-center gap-4 mb-4 sm:mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                      activeCategory === category.id
                        ? "bg-customBlue text-black"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                  >
                    <category.icon className="text-sm" />
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </motion.div>
            </div>
          </section>

          {/* FAQ Items */}
          <section className="pb-20 px-4 md:px-8 lg:px-16">
            <div className="max-w-4xl mx-auto">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-800 transition-all duration-300"
                    >
                      <h3 className="text-lg font-semibold pr-4">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0">
                        {openFAQ === faq.id ? (
                          <FaMinus className="text-customBlue text-sm" />
                        ) : (
                          <FaPlus className="text-customBlue text-sm" />
                        )}
                      </div>
                    </button>
                    <AnimatePresence>
                      {openFAQ === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 pt-0">
                            <div className="border-t border-gray-800 pt-4">
                              <p className="text-gray-300 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="pb-20 px-4 md:px-8 lg:px-16">
            <div className="max-w-4xl mx-auto">
              <motion.div
                className="bg-gray-900 rounded-xl p-8 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold mb-4">
                  Still have questions?
                </h3>
                <p className="text-gray-400 mb-6">
                  Our friendly team is here to help. Reach out to us and we'll
                  get back to you as soon as possible.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/en/Contact"
                    className="bg-customBlue hover:bg-customHoverBlue text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  >
                    Contact Us
                  </a>
                  <a
                    href="/en/services"
                    className="border-2 border-customBlue text-customBlue hover:bg-customBlue hover:text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  >
                    View Plans
                  </a>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQPage;
