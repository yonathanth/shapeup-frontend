"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import aboutUsHero from "../../../../assets/images/about.jpeg";
import ourPhilo from "../../../../assets/images/ourPhilosophy.jpg";
import trainers from "../../../../assets/images/trainers.jpg";
import photo from "../../../../public/photo.png";
import { motion } from "framer-motion";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const AboutUsPage = () => {
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

  const teamMembers = [
    {
      name: "Nardos Amakele",
      image: photo,
    },
    {
      name: "Samuel Tesfaye",
      image: photo,
    },
    {
      name: "Lidiya Gebru",
      image: photo,
    },
    {
      name: "Dawit Mekonnen",
      image: photo,
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
            backgroundImage: `url(${aboutUsHero.src})`,
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
              About Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-base md:text-xl text-white/90 max-w-xs md:max-w-2xl text-center mb-12"
            >
              Discover our story, philosophy, and the team dedicated to your
              fitness journey
            </motion.p>
            <motion.div
              onClick={scrollToNextSection}
              className="border-2 border-white/50 rounded-full p-3 cursor-pointer hover:border-[#F1AC17] transition-all"
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
                className="text-white text-xl rotate-180 hover:text-[#F1AC17] transition-colors"
              />
            </motion.div>
          </div>
        </div>

        {/* About Section */}
        <div ref={nextSectionRef} className="relative z-10 ">
          <div className="bg-gray-950">
            <div className="text-white flex flex-col md:flex-row items-center px-6 justify-center gap-8 md:gap-16 py-16 md:py-24 mx-auto max-w-7xl">
              {/* Left Image */}
              <motion.div
                className="w-full md:w-1/2 flex justify-center items-center"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="relative w-full max-w-[550px] overflow-hidden rounded-lg border border-gray-800 hover:border-[#F1AC17]/30 transition-all">
                  <Image
                    src={trainers}
                    alt="Professional trainers at our gym"
                    width={600}
                    height={500}
                    className="object-cover w-full h-auto md:h-[450px] transition-transform duration-500 hover:scale-[1.02]"
                    priority
                  />
                </div>
              </motion.div>

              {/* Right Text */}
              <motion.div
                className="w-full md:w-1/2 px-0 md:px-4 py-8 text-center md:text-left"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  Welcome To Our <br />
                  <span className="text-[#F1AC17]">Fitness Gym</span>
                </h2>
                <p className="text-base md:text-lg text-gray-400 mb-8 leading-relaxed">
                  At ShapeUp, we're dedicated to helping you achieve your
                  fitness goals with state-of-the-art facilities, expert
                  trainers, and a supportive community. Our personalized
                  approach ensures every member gets the attention they need to
                  transform their health and wellness.
                </p>
                <div className="flex justify-center md:justify-start">
                  <button className="bg-[#F1AC17] hover:bg-[#7F5A0B] text-black font-medium px-8 py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] shadow hover:shadow-[#F1AC17]/20">
                    Join Us Now
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Video Section */}
          <div className="-mt-20 relative z-20 px-4 mb-20">
            <div className="max-w-5xl mx-auto overflow-hidden rounded-xl shadow-lg border border-[#F1AC17]/20">
              <iframe
                className="w-full h-[400px] md:h-[500px] object-cover rounded-xl"
                src="https://www.youtube.com/embed/veuUyWcIbNY?autoplay=1&mute=1&loop=1&playlist=veuUyWcIbNY"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Community Section */}
          <div className="flex flex-col md:flex-row items-center justify-center text-center px-6 md:px-16 lg:px-24 md:py-20 bg-gray-950">
            {/* Left Image */}
            <div className="max-w-7xl flex flex-col md:flex-row">
              <motion.div
                className="w-full md:w-1/2 p-4 flex justify-center items-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Image
                  src={trainers}
                  alt="Fitness community"
                  width={500}
                  height={300}
                  className="object-cover rounded-xl w-full h-auto max-h-[400px] shadow-2xl border border-gray-800"
                />
              </motion.div>

              {/* Right Text */}
              <motion.div
                className="w-full md:w-1/2 px-4 md:px-8 py-8 text-center md:text-left"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  Where Fitness Meets Community
                </h2>
                <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed">
                  Our gym isn't just about workouts - it's about building
                  relationships and achieving goals together. We've created a
                  space where everyone feels welcome and supported.
                </p>
                <div className="grid text-center items-center grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Personalized coaching",
                    "Nutrition plans",
                    "Strength training",
                    "Flexible hours",
                    "Group workouts",
                    "Wellness programs",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex text-center justify-center items-center"
                    >
                      <span className="mr-3 text-center text-[#F1AC17] text-xl">
                        →
                      </span>
                      <span className="text-center text-gray-200">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Vision Section */}
          <div className="py-12 md:py-24 text-center bg-gray-950">
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-12 md:mb-20 text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Our Vision
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 max-w-6xl mx-auto">
              {[
                {
                  title: "Personal Training Programs",
                  content:
                    "Tailored workouts designed specifically for your goals and fitness level.",
                },
                {
                  title: "Group Classes",
                  content:
                    "Energetic, instructor-led sessions that build strength and community.",
                },
                {
                  title: "Nutrition Coaching",
                  content:
                    "Science-based plans to fuel your body for optimal performance.",
                },
                {
                  title: "24/7 Access",
                  content:
                    "Flexible scheduling with round-the-clock gym availability.",
                },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  className="p-8 bg-gray-900 rounded-lg hover:bg-gray-800 transition-all border border-gray-800 group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 mb-4 rounded-full bg-[#F1AC17]/10 group-hover:bg-[#F1AC17]/20 flex items-center justify-center transition-all">
                      <svg
                        className="w-5 h-5 text-[#F1AC17]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-400">{card.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="px-6 sm:px-8 py-10 md:py-20 w-full flex flex-col items-center bg-gray-950">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-bold text-[#F1AC17] mb-3">
                The Team
              </h2>
              <p className="text-2xl sm:text-3xl font-medium text-white">
                Our Professional Trainers
              </p>
            </motion.div>

            <div className="w-full max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-32 h-32 md:w-52 md:h-52 mx-auto mb-6 relative overflow-hidden rounded-lg border border-gray-800 hover:border-[#F1AC17]/30 transition-all">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-white">
                      {member.name}
                    </h3>
                    <div className="flex hover:text-[#7F5A0B] transition-colors cursor-pointer justify-center space-x-4 text-[#F1AC17]">
                      <FaPhoneAlt />
                      <FaEnvelope />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Explore Section */}
          <div className="relative py-20 md:py-28 px-6 text-center bg-gray-950">
            <div className="absolute inset-0 bg-[url('/explore-bg.jpg')] bg-cover bg-center opacity-10 -z-10"></div>
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Explore Our Gym
              </h2>
              <p className="text-xl text-[#F1AC17] mb-8">
                Elevate Your Journey
              </p>
              <p className="text-base md:text-lg text-gray-400 mb-10 leading-relaxed">
                Discover state-of-the-art equipment, expert trainers, and a
                community that will push you to new heights. Your transformation
                starts here.
              </p>
              <button className="bg-[#F1AC17] hover:bg-[#7F5A0B] text-black font-bold px-12 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-[#F1AC17]/30">
                Schedule a Tour
              </button>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUsPage;
