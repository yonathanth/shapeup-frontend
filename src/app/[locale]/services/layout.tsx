import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fitness Services - ShapeUp Sport Zone | Quality Training Programs",
  description:
    "Discover quality fitness services at ShapeUp Sport Zone Addis Ababa: Strength Training, CrossFit, Muay Thai, Kickboxing, Group Exercise, Women's Only Section, Sports Courts, Recovery Center with Steam & Ice Baths, and Juice Bar. Experienced trainers and reliable equipment.",
  openGraph: {
    title: "Quality Fitness Services - ShapeUp Sport Zone Addis Ababa",
    description:
      "Experience comprehensive fitness programs at our dedicated training facility. CrossFit, Muay Thai, Kickboxing, Strength Training, Sports Courts, Recovery Center, and more in Sarbet, Addis Ababa.",
  },
  twitter: {
    title: "Quality Fitness Services - ShapeUp Sport Zone Addis Ababa",
    description:
      "Experience comprehensive fitness programs at our dedicated training facility. CrossFit, Muay Thai, Kickboxing, Strength Training, Sports Courts, Recovery Center, and more in Sarbet, Addis Ababa.",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
