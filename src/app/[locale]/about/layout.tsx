import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ShapeUp Sport Zone - Premium Fitness Center in Addis Ababa",
  description:
    "Discover ShapeUp Sport Zone's story - Addis Ababa's premier fitness destination in Sarbet. Learn about our world-class facilities, expert trainers, advanced equipment, and commitment to transforming lives through fitness. From CrossFit and Muay Thai to recovery centers and nutrition guidance.",
  openGraph: {
    title: "About ShapeUp Sport Zone - Premium Fitness Center in Addis Ababa",
    description:
      "Discover Ethiopia's most advanced fitness facility. Learn about our world-class equipment, expert trainers, and comprehensive programs including CrossFit, Muay Thai, sports courts, and recovery facilities in Sarbet, Addis Ababa.",
  },
  twitter: {
    title: "About ShapeUp Sport Zone - Premium Fitness Center in Addis Ababa",
    description:
      "Discover Ethiopia's most advanced fitness facility. Learn about our world-class equipment, expert trainers, and comprehensive programs including CrossFit, Muay Thai, sports courts, and recovery facilities in Sarbet, Addis Ababa.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
