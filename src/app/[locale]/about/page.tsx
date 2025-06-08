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
import style from "../styles/ButtonStyles.module.css";
import { Link } from "../../../i18n/routing";
import React from "react";
import { useTranslations } from "next-intl";

const AboutUsPage = () => {
  const t = useTranslations("about_page"); // Use the correct hook

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
          className=" relative w-full h-[100vh] bg-fixed bg-center bg-cover"
          style={{
            backgroundImage: `url(${aboutUsHero.src})`,
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col   items-center justify-center">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl font-bold text-white "
            >
              {t("hero.title")}
            </motion.h1>
            <div className="flex justify-center pt-4">
              <motion.div
                onClick={scrollToNextSection}
                className="bottom-4 justify-center border border-white rounded-full p-4 cursor-pointer text-white"
                whileHover={{ scale: 1.1 }} // Hover effect for smoother interaction
                whileTap={{ scale: 0.9 }} // Tap effect for feedback
                animate={isJumping ? { y: [0, -10, 0] } : {}}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                  repeat: isJumping ? 1 : 0, // Jump twice
                }}
              >
                <FontAwesomeIcon
                  icon={faArrowUp}
                  className="text-white text-xl"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      {/* Join Us Section */}

      <Footer />
    </>
  );
};

export default AboutUsPage;
