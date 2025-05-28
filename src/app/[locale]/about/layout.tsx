import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | shape up fitness",
  description:
    "Learn about shape up fitness's mission, values, and dedicated team helping members achieve their fitness goals in Addis.",
  openGraph: {
    title: "About shape up fitness | Premier Fitness Center in Addis",
    description:
      "Discover our story, mission, and the team behind shape up fitness - dedicated to transforming lives through fitness and wellness.",
  },
  twitter: {
    title: "About shape up fitness | Premier Fitness Center in Addis",
    description:
      "Discover our story, mission, and the team behind shape up fitness - dedicated to transforming lives through fitness and wellness.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
