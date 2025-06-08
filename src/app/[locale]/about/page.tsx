"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import aboutUsHero from "../../../../assets/images/about.jpeg";
import ourPhilo from "../../../../assets/images/ourPhilosophy.jpg";
import trainers from "../../../../assets/images/trainers.jpg";
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
      image: trainers,
    },
    {
      name: "Samuel Tesfaye",
      image: trainers,
    },
    {
      name: "Lidiya Gebru",
      image: trainers,
    },
    {
      name: "Dawit Mekonnen",
      image: trainers,
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
              About ShapeUp Fitness
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg md:text-xl text-white/90 max-w-2xl text-center mb-12"
            >
              Discover our story, philosophy, and the team dedicated to your
              fitness journey
            </motion.p>
            <motion.div
              onClick={scrollToNextSection}
              className="border-2 border-white/50 rounded-full p-3 cursor-pointer hover:border-white transition-all"
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
                className="text-white text-xl rotate-180"
              />
            </motion.div>
          </div>
        </div>

        {/* About Section */}
        <div ref={nextSectionRef} className="relative z-10 bg-black">
          <div className="backdrop-blur-sm text-white flex flex-col md:flex-row items-center justify-center gap-12 px-6 md:px-16 lg:px-24 py-20 md:py-28 mx-auto max-w-7xl">
            {/* Left Image */}
            <motion.div
              className="w-full md:w-1/2 flex justify-center items-center"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative w-full h-full max-w-[550px] overflow-hidden rounded-xl shadow-2xl">
                <Image
                  src={trainers}
                  alt="Professional trainers at our gym"
                  width={600}
                  height={500}
                  className="object-cover w-full h-auto md:h-[450px] transition-transform duration-500 hover:scale-105"
                  priority
                />
              </div>
            </motion.div>

            {/* Right Text */}
            <motion.div
              className="w-full md:w-1/2 px-4 md:px-8 py-8 text-center md:text-left"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-bold text-customBlue tracking-wider uppercase">
                About Us
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 mt-2 leading-tight">
                Welcome To Our{" "}
                <span className="text-customBlue">Fitness Gym</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                At ShapeUp, we're dedicated to helping you achieve your fitness
                goals with state-of-the-art facilities, expert trainers, and a
                supportive community. Our personalized approach ensures every
                member gets the attention they need to transform their health
                and wellness.
              </p>
              <div className="flex justify-center md:justify-start">
                <button className="bg-customBlue hover:bg-customHoverBlue text-black font-bold px-10 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                  Join Us Now
                </button>
              </div>
            </motion.div>
          </div>

          {/* Video Section */}
          <div className="-mt-20 relative z-20 px-4 mb-20">
            <div className="max-w-5xl mx-auto overflow-hidden rounded-xl shadow-lg">
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
          <div className="flex flex-col md:flex-row items-center justify-center px-6 md:px-16 lg:px-24 py-20 bg-black/50 backdrop-blur-sm">
            {/* Left Image */}
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
                className="object-cover rounded-xl w-full h-auto max-h-[400px] shadow-2xl"
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Where Fitness Meets Community
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                Our gym isn't just about workouts - it's about building
                relationships and achieving goals together. We've created a
                space where everyone feels welcome and supported.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Personalized coaching",
                  "Nutrition plans",
                  "Strength training",
                  "Flexible hours",
                  "Group workouts",
                  "Wellness programs",
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <span className="mr-3 text-customBlue text-xl">→</span>
                    <span className="text-gray-200">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Vision Section */}
          <div className="py-20 text-center bg-black/70 backdrop-blur-sm">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Our Vision
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 max-w-6xl mx-auto">
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
                  className="p-8 bg-gray-900 rounded-xl shadow-lg hover:shadow-customBlue/20 transition-all border border-gray-800 hover:border-customBlue/30"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-bold text-customBlue mb-4">
                    {card.title}
                  </h3>
                  <p className="text-gray-300">{card.content}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="px-6 sm:px-8 py-20 w-full flex flex-col items-center bg-black/50 backdrop-blur-sm">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-bold text-customBlue mb-3">
                The Team
              </h2>
              <p className="text-2xl sm:text-3xl font-medium">
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
                    <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 relative rounded-full overflow-hidden border-2 border-customBlue/50 hover:border-customBlue transition-all">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-medium mb-2">{member.name}</h3>
                    <div className="flex justify-center space-x-4">
                      <FaPhoneAlt />
                      <FaEnvelope />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Explore Section */}
          <div className="relative py-32 px-6 text-center bg-black/70 backdrop-blur-sm">
            <div className="absolute inset-0 bg-[url('/explore-bg.jpg')] bg-cover bg-center opacity-20 -z-10"></div>
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Explore Our Gym
              </h2>
              <p className="text-xl text-customBlue mb-8">
                Elevate Your Journey
              </p>
              <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                Discover state-of-the-art equipment, expert trainers, and a
                community that will push you to new heights. Your transformation
                starts here.
              </p>
              <button className="bg-customBlue hover:bg-customHoverBlue text-black font-bold px-12 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
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
