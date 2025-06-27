import Header from "./components/Header";
import Hero from "./components/Hero";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
import Footer from "./components/Footer";
config.autoAddCss = false;

import { Metadata } from "next";
import Login from "./Login/page";
import About from "./components/About";

export const metadata: Metadata = {
  title: "ShapeUp Sport Zone - Premium Fitness Center in Addis Ababa, Ethiopia",
  description:
    "Transform your fitness journey at ShapeUp Sport Zone - Addis Ababa's premier fitness destination. World-class equipment, expert trainers, CrossFit, Muay Thai, kickboxing, sports courts, recovery facilities, and nutrition guidance in Sarbet, Addis Ababa.",
  openGraph: {
    title: "ShapeUp Sport Zone - Premium Fitness Center in Addis Ababa",
    description:
      "Experience Ethiopia's most advanced fitness facility. Premium equipment, expert training, CrossFit, Muay Thai, recovery center, and more at ShapeUp Sport Zone in Sarbet, Addis Ababa.",
  },
  twitter: {
    title: "ShapeUp Sport Zone - Premium Fitness Center in Addis Ababa",
    description:
      "Experience Ethiopia's most advanced fitness facility. Premium equipment, expert training, CrossFit, Muay Thai, recovery center, and more at ShapeUp Sport Zone in Sarbet, Addis Ababa.",
  },
};

export default function Home() {
  return (
    <body>
      <main>
        <Header />

        <Hero />
        <About />
        <Footer />

        {/* <Login /> */}
      </main>
    </body>
  );
}
