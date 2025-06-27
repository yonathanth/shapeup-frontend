import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fitness Services - ShapeUp Sport Zone | Premium Training Programs",
  description:
    "Discover premium fitness services at ShapeUp Sport Zone Addis Ababa: Strength Training, CrossFit, Muay Thai, Kickboxing, Group Exercise, Women's Only Section, Sports Courts, Recovery Center with Steam & Ice Baths, and Juice Bar. Expert trainers and world-class equipment.",
  openGraph: {
    title: "Premium Fitness Services - ShapeUp Sport Zone Addis Ababa",
    description:
      "Experience comprehensive fitness programs at Ethiopia's premier training facility. CrossFit, Muay Thai, Kickboxing, Strength Training, Sports Courts, Recovery Center, and more in Sarbet, Addis Ababa.",
  },
  twitter: {
    title: "Premium Fitness Services - ShapeUp Sport Zone Addis Ababa",
    description:
      "Experience comprehensive fitness programs at Ethiopia's premier training facility. CrossFit, Muay Thai, Kickboxing, Strength Training, Sports Courts, Recovery Center, and more in Sarbet, Addis Ababa.",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
