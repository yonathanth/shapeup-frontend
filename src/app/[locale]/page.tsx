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
  title: "ShapeUp Sport Zone - Fitness Center in Addis Ababa, Ethiopia",
  description:
    "Work toward your fitness goals at ShapeUp Sport Zone - a dedicated fitness center in Sarbet, Addis Ababa. Quality equipment, experienced trainers, CrossFit, Muay Thai, kickboxing, sports courts, recovery facilities, and nutrition guidance.",
  openGraph: {
    title: "ShapeUp Sport Zone - Fitness Center in Addis Ababa",
    description:
      "A welcoming fitness center in Sarbet, Addis Ababa. Quality equipment, experienced training, CrossFit, Muay Thai, recovery center, and more at ShapeUp Sport Zone.",
  },
  twitter: {
    title: "ShapeUp Sport Zone - Fitness Center in Addis Ababa",
    description:
      "A welcoming fitness center in Sarbet, Addis Ababa. Quality equipment, experienced training, CrossFit, Muay Thai, recovery center, and more at ShapeUp Sport Zone.",
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
