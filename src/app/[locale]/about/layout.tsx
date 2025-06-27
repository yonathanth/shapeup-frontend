import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ShapeUp Sport Zone - Fitness Center in Addis Ababa",
  description:
    "Discover ShapeUp Sport Zone's story - a dedicated fitness center in Sarbet, Addis Ababa. Learn about our quality facilities, experienced trainers, reliable equipment, and commitment to supporting your fitness journey. From CrossFit and Muay Thai to recovery centers and nutrition guidance.",
  openGraph: {
    title: "About ShapeUp Sport Zone - Fitness Center in Addis Ababa",
    description:
      "Discover our welcoming fitness facility. Learn about our quality equipment, experienced trainers, and comprehensive programs including CrossFit, Muay Thai, sports courts, and recovery facilities in Sarbet, Addis Ababa.",
  },
  twitter: {
    title: "About ShapeUp Sport Zone - Fitness Center in Addis Ababa",
    description:
      "Discover our welcoming fitness facility. Learn about our quality equipment, experienced trainers, and comprehensive programs including CrossFit, Muay Thai, sports courts, and recovery facilities in Sarbet, Addis Ababa.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
