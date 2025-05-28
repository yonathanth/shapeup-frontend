import Header from "./components/Header";
import Footer from "./components/Footer";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
config.autoAddCss = false;
import OurServices from "./components/OurServices";
import Shop from "./components/Shops";
import Supporting from "./components/Supporting";
import Contact from "./components/Contact";
import Hero from "./components/Hero";
import About from "./components/About";
import { Metadata } from "next";
import Testimonials from "./components/Testimonials";
import Login from "./Login/page";

export const metadata: Metadata = {
  title: "shape up fitness - Premier Fitness Center in Addis",
  description:
    "Transform your body and life at shape up fitness. Professional trainers, state-of-the-art equipment, and personalized programs for all fitness levels.",
  openGraph: {
    title: "shape up fitness - Premium Gym & Fitness Center in Addis",
    description:
      "Join shape up fitness for personalized training programs, state-of-the-art equipment, and expert guidance to achieve your fitness goals.",
  },
  twitter: {
    title: "shape up fitness - Premium Gym & Fitness Center in Addis",
    description:
      "Join shape up fitness for personalized training programs, state-of-the-art equipment, and expert guidance to achieve your fitness goals.",
  },
};

export default function Home() {
  return (
    <body>
      <main>
        {/* <Header />

        <Hero />
        <About />
        <OurServices />
        
        <Testimonials />
        <Contact />

        <Footer /> */}
        <Login />
      </main>
    </body>
  );
}
