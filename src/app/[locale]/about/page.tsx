"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import aboutUsHero from "../../../../assets/heroImages/three.jpg";
import ourPhilo from "../../../../assets/images/ourPhilosophy.jpg";
import community from "../../../../assets/heroImages/ten.jpg";
import trainers from "../../../../assets/images/trainers.jpg";
import philosophy from "../../../../assets/heroImages/nine.jpg";
import { motion } from "framer-motion";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "../../../i18n/routing";
import {
  UserRoundCog,
  Goal,
  CheckCircle,
  UtensilsCrossed,
  CalendarClock,
  UsersRound,
  HeartPulse,
} from "lucide-react";
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

        {/* About Section */}
        <div ref={nextSectionRef} id="philosophy" className="relative z-10 ">
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
                <div className="relative w-full max-w-[550px] overflow-hidden rounded-lg border border-gray-800 hover:border-customBlue/30 transition-all">
                  <Image
                    src={philosophy}
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
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-customBlue uppercase tracking-wider mb-3">
                    Our Philosophy
                  </h2>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                    Transforming Lives Through <br />
                    <span className="text-customBlue">Fitness Excellence</span>
                  </h3>
                </div>
                <p className="text-base md:text-lg text-gray-300 mb-8 leading-relaxed">
                  At ShapeUp Gym & Fitness, we believe fitness is more than just
                  exercise—it's a lifestyle transformation. Located in the heart
                  of Sarbet, Addis Ababa, we provide world-class facilities,
                  expert guidance, and a supportive community to help you
                  achieve your health and wellness goals.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-customBlue mr-3" />
                    <span className="text-gray-300">Expert Trainers</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-customBlue mr-3" />
                    <span className="text-gray-300">Modern Equipment</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-customBlue mr-3" />
                    <span className="text-gray-300">Flexible Hours</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-customBlue mr-3" />
                    <span className="text-gray-300">Community Focus</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Video Section */}
          <div className="py-20 bg-gray-900">
            <div className="max-w-6xl mx-auto px-6">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-sm font-semibold text-customBlue uppercase tracking-wider mb-4">
                  See Us In Action
                </h2>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Experience <span className="text-customBlue">ShapeUp</span>
                </h3>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Take a virtual tour of our state-of-the-art facilities and see
                  what makes ShapeUp the premier fitness destination in Addis
                  Ababa.
                </p>
              </motion.div>

              <motion.div
                className="relative overflow-hidden rounded-2xl shadow-2xl border border-customBlue/20"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <iframe
                  className="w-full h-[400px] md:h-[500px] lg:h-[600px]"
                  src="https://www.youtube.com/embed/e4fzvCCTJ90?autoplay=0&mute=0&loop=1&playlist=e4fzvCCTJ90&controls=1"
                  title="ShapeUp Sport Zone - Premium Fitness Experience"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </motion.div>
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
                  src={community}
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
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-customBlue uppercase tracking-wider mb-3">
                    Our Community
                  </h2>
                  <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                    Where Fitness Meets{" "}
                    <span className="text-customBlue">Community</span>
                  </h3>
                </div>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  Join a community that celebrates every milestone, supports
                  every challenge, and believes in your potential. At ShapeUp,
                  you're not just a member—you're family.
                </p>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-customBlue mb-2">
                      200+
                    </div>
                    <div className="text-sm text-gray-400">Active Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-customBlue mb-2">
                      9+
                    </div>
                    <div className="text-sm text-gray-400">
                      Training Programs
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-customBlue mb-2">
                      5+
                    </div>
                    <div className="text-sm text-gray-400">Expert Trainers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-customBlue mb-2">
                      16
                    </div>
                    <div className="text-sm text-gray-400">Hours Operation</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: UserRoundCog, text: "Personalized coaching" }, // Better for personal coaching
                    { icon: Goal, text: "Goal-oriented training" }, // More direct goal representation
                    { icon: UtensilsCrossed, text: "Nutrition guidance" }, // Better food/nutrition icon
                    { icon: CalendarClock, text: "Flexible scheduling" }, // Better for scheduling
                    { icon: UsersRound, text: "Group fitness classes" }, // Better for group activities
                    { icon: HeartPulse, text: "Wellness programs" }, // Better for wellness concept
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all"
                    >
                      <item.icon className="w-5 h-5 text-customBlue mr-3" />
                      <span className="text-gray-200">{item.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Vision Section */}
          <div
            id="facilities"
            className="py-12 md:py-24 text-center bg-gray-950"
          >
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-semibold text-customBlue uppercase tracking-wider mb-4">
                What We Offer
              </h2>
              <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                World-Class <span className="text-customBlue">Facilities</span>
              </h3>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Experience fitness like never before with our comprehensive
                range of services and state-of-the-art equipment.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 max-w-6xl mx-auto">
              {[
                {
                  title: "Strength & CrossFit Training",
                  content:
                    "Build muscle and endurance with our comprehensive strength and functional fitness programs.",
                },
                {
                  title: "Martial Arts Classes",
                  content:
                    "Learn Kickboxing and Muay Thai with expert instructors in a supportive environment.",
                },
                {
                  title: "Sports Courts & Recovery",
                  content:
                    "Professional futsal and basketball courts plus steam bath and ice bath facilities.",
                },
                {
                  title: "Juice Bar & Women's Section",
                  content:
                    "Fresh healthy drinks and dedicated women-only training space for comfort and privacy.",
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
                    <div className="w-12 h-12 mb-4 rounded-full bg-customBlue/10 group-hover:bg-customBlue/20 flex items-center justify-center transition-all">
                      <svg
                        className="w-5 h-5 text-customBlue"
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

          {/* Gym Photo Showcase */}
          <div className="py-16 md:py-20 bg-gray-900">
            <div className="max-w-6xl mx-auto px-6">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-sm font-semibold text-customBlue uppercase tracking-wider mb-4">
                  Our Gym
                </h2>
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  Modern <span className="text-customBlue">Equipment</span> &
                  Facilities
                </h3>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Step inside our world-class facility and discover why ShapeUp
                  is the premier fitness destination in Addis Ababa.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  className="relative overflow-hidden rounded-2xl h-80"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Image
                    src={philosophy}
                    alt="Strength Training Equipment"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h4 className="text-xl font-bold mb-2">
                      Strength Training Zone
                    </h4>
                    <p className="text-gray-200">
                      Premium weight equipment and free weights for all fitness
                      levels
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="relative overflow-hidden rounded-2xl h-80"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Image
                    src={community}
                    alt="Group Training Classes"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h4 className="text-xl font-bold mb-2">Group Training</h4>
                    <p className="text-gray-200">
                      Dynamic classes including CrossFit, Kickbox, and Muay Thai
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="relative overflow-hidden rounded-2xl h-80"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Image
                    src={trainers}
                    alt="Sports Courts"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h4 className="text-xl font-bold mb-2">Sports Courts</h4>
                    <p className="text-gray-200">
                      Professional futsal and basketball courts for competitive
                      play
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="relative overflow-hidden rounded-2xl h-80"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Image
                    src={ourPhilo}
                    alt="Recovery Center"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h4 className="text-xl font-bold mb-2">
                      Recovery & Wellness
                    </h4>
                    <p className="text-gray-200">
                      Steam bath, ice bath, and juice bar for complete recovery
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="relative py-20 md:py-28 px-6 text-center bg-gradient-to-r from-gray-900 to-gray-950">
            <div className="absolute inset-0 bg-black/20"></div>
            <motion.div
              className="max-w-4xl mx-auto relative z-10"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-semibold text-customBlue uppercase tracking-wider mb-4">
                Ready to Transform?
              </h2>
              <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                Your Fitness Journey <br />
                <span className="text-customBlue">Starts Today</span>
              </h3>
              <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                Join hundreds of members who have already transformed their
                lives at ShapeUp. Take the first step towards a healthier,
                stronger you.
              </p>

              <div className="flex justify-center">
                <Link href="/Register">
                  <button className="bg-customBlue hover:bg-customHoverBlue text-black font-bold px-10 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-customBlue/30 text-lg">
                    Join ShapeUp Today
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUsPage;
