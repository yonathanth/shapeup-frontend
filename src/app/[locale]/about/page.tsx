// "use client";

// import { useRef, useEffect, useState } from "react";
// import Image from "next/image";
// import aboutUsHero from "../../../../assets/images/about.jpeg";
// import ourPhilo from "../../../../assets/images/ourPhilosophy.jpg";
// import trainers from "../../../../assets/images/trainers.jpg";
// import { motion } from "framer-motion";
// import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import style from "../styles/ButtonStyles.module.css";
// import { Link } from "../../../i18n/routing";
// import Staff from "./componenets/ourStaff";
// import React from "react";
// import { useTranslations } from "next-intl";

// const AboutUsPage = () => {
//   const t = useTranslations("about_page"); // Use the correct hook

//   const [isJumping, setIsJumping] = useState(true);
//   const nextSectionRef = useRef<HTMLDivElement | null>(null);
//   const scrollToNextSection = () => {
//     if (nextSectionRef.current) {
//       nextSectionRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   };
//   useEffect(() => {
//     let timeoutId: NodeJS.Timeout;
//     if (isJumping) {
//       timeoutId = setTimeout(() => {
//         setIsJumping(false);
//       }, 1200);
//     } else {
//       timeoutId = setTimeout(() => {
//         setIsJumping(true);
//       }, 3000);
//     }
//     return () => clearTimeout(timeoutId);
//   }, [isJumping]);
//   return (
//     <>
//       <Header />
//       <div className="bg-black text-white scroll-container relative">
//         {/* Neon Line - Connected and fixed */}
//         <motion.div
//           className="absolute top-0 left-[50%] h-full w-1 bg-[#871818] neon-glow hidden lg:block"
//           initial={{ scaleY: 0 }}
//           animate={{ scaleY: 1 }}
//           transition={{ duration: 1, ease: "easeInOut" }}
//           style={{ transformOrigin: "top" }}
//         ></motion.div>

//         {/* Hero Section */}
//         <div
//           className=" relative w-full h-[100vh] bg-fixed bg-center bg-cover"
//           style={{
//             backgroundImage: `url(${aboutUsHero.src})`,
//             backgroundAttachment: "fixed",
//           }}
//         >
//           <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col   items-center justify-center">
//             <motion.h1
//               initial={{ opacity: 0, y: -50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               className="text-6xl font-bold text-white "
//             >
//               {t("hero.title")}
//             </motion.h1>
//             <div className="flex justify-center pt-4">
//               <motion.div
//                 onClick={scrollToNextSection}
//                 className="bottom-4 justify-center border border-white rounded-full p-4 cursor-pointer text-white"
//                 whileHover={{ scale: 1.1 }} // Hover effect for smoother interaction
//                 whileTap={{ scale: 0.9 }} // Tap effect for feedback
//                 animate={isJumping ? { y: [0, -10, 0] } : {}}
//                 transition={{
//                   duration: 0.6,
//                   ease: "easeInOut",
//                   repeat: isJumping ? 1 : 0, // Jump twice
//                 }}
//               >
//                 <FontAwesomeIcon
//                   icon={faArrowUp}
//                   className="text-white text-xl"
//                 />
//               </motion.div>
//             </div>
//           </div>
//         </div>

//         {/* Section 1 - About shape up fitness */}
//         <section
//           className="scroll-section sm:px-[5rem] md:px-[9rem] sm:pt-2 md:pt-20"
//           ref={nextSectionRef}
//         >
//           <section className="flex flex-col md:flex-row items-center pt-12 gap-20">
//             <div className="md:w-1/2 px-6">
//               <div className="relative">
//                 <motion.h2
//                   className="text-[7rem] font-bold text-gray-800 tracking-tight"
//                   initial={{ opacity: 0 }}
//                   whileInView={{ opacity: 0.8, x: 0 }}
//                   transition={{ duration: 1 }}
//                 >
//                   {t("sections.0.id")}
//                 </motion.h2>
//                 <motion.h2
//                   className="absolute top-1/2 left-0 text-2xl font-semibold mb-6 text-customBlue transform -translate-y-1/2"
//                   initial={{ opacity: 0, x: -50 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.8 }}
//                 >
//                   {t("sections.0.title")}
//                 </motion.h2>
//               </div>

//               <motion.p
//                 className="text-base leading-relaxed text-gray-400 mt-[-1.5rem]"
//                 initial={{ opacity: 0, y: 50 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8 }}
//               >
//                 {t("sections.0.content")}
//               </motion.p>
//             </div>

//             <motion.div
//               className="w-full lg:w-1/2 relative md:h-80 h-60 lg:h-60 "
//               initial={{ opacity: 0, scale: 0.9 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.8 }}
//             >
//               <Image
//                 src={aboutUsHero}
//                 alt="About shape up fitness"
//                 objectFit="cover"
//                 className="rounded-lg"
//                 layout="fill"
//               />
//             </motion.div>
//           </section>

//           {/* Section 2 - Our Philosophy */}
//           <section
//             id="our-philosophy"
//             className="scroll-section flex flex-col-reverse md:flex-row items-center py-14 gap-20"
//           >
//             <motion.div
//               className="w-full lg:w-1/2 relative md:h-80 h-60 lg:h-60"
//               initial={{ opacity: 0, scale: 0.9 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.8 }}
//             >
//               <Image
//                 src={aboutUsHero}
//                 alt="Our Philosophy"
//                 layout="fill"
//                 objectFit="cover"
//                 className="rounded-lg"
//               />
//             </motion.div>

//             <div className="md:w-1/2 px-6">
//               <div className="relative">
//                 <motion.h2
//                   className="text-[7rem] font-bold text-gray-800 tracking-tight"
//                   initial={{ opacity: 0 }}
//                   whileInView={{ opacity: 0.8 }}
//                   transition={{ duration: 1 }}
//                 >
//                   {t("sections.1.id")}
//                 </motion.h2>
//                 <motion.h2
//                   className="text-2xl font-semibold mb-6 text-[#871818] absolute top-1/2 left-0 transform -translate-y-1/2"
//                   initial={{ opacity: 0, x: -50 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.8 }}
//                 >
//                   {t("sections.1.title")}
//                 </motion.h2>
//               </div>
//               <motion.p
//                 className="text-base leading-relaxed text-gray-400 mt-[-1.5rem]"
//                 initial={{ opacity: 0, y: 50 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8 }}
//               >
//                 {t("sections.1.content")}
//               </motion.p>
//             </div>
//           </section>

//           {/* Section 3 - Our Facilities & Trainers */}
//           <section
//             id="our-Facilities"
//             className="scroll-section flex flex-col md:flex-row items-center pb-40  gap-20"
//           >
//             <div className="md:w-1/2 sm:w-full sm:px-0 px-6">
//               <div className="relative">
//                 <motion.h2
//                   className="text-[7rem] font-bold text-gray-800 tracking-tight"
//                   initial={{ opacity: 0 }}
//                   whileInView={{ opacity: 0.8 }}
//                   transition={{ duration: 1 }}
//                 >
//                   {t("sections.2.id")}
//                 </motion.h2>
//                 <motion.h2
//                   className="text-2xl font-semibold mb-6 text-[#871818] absolute top-1/2 left-0 transform -translate-y-1/2"
//                   initial={{ opacity: 0, x: -50 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.8 }}
//                 >
//                   {t("sections.2.title")}
//                 </motion.h2>
//               </div>
//               <motion.p
//                 className="text-base leading-relaxed text-gray-400 mt-[-1.5rem]"
//                 initial={{ opacity: 0, y: 50 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8 }}
//               >
//                 {t("sections.2.content")}
//               </motion.p>
//             </div>

//             <motion.div
//               className="w-full lg:w-1/2 relative md:h-80 h-60 lg:h-60"
//               initial={{ opacity: 0, scale: 0.9 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.8 }}
//             >
//               <Image
//                 src={aboutUsHero}
//                 alt="Our Facilities"
//                 objectFit="cover"
//                 className="rounded-lg"
//                 layout="fill"
//               />
//             </motion.div>
//           </section>
//         </section>
//       </div>
//       {/* Join Us Section */}

//       <section className="mx-auto text-center">
//         <Link href="/Register">
//           <motion.button
//             className=" button-custom text-xl text-[#871818] border border-solid border-[#871818] rounded-md px-5 py-1"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <span>{t("sections.3.callToAction")}</span>
//           </motion.button>
//         </Link>
//       </section>
//       <div id="our-Team">
//         <Staff />
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default AboutUsPage;

import React from "react";

const about = () => {
  return <div>about</div>;
};

export default about;
