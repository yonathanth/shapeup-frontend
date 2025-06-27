import { ReactNode } from "react";
import { Metadata } from "next";

interface FAQLayoutProps {
  children: ReactNode;
}

export default function FAQLayout({ children }: FAQLayoutProps) {
  return <>{children}</>;
}

export const metadata: Metadata = {
  title: "FAQ - ShapeUp Sport Zone | Fitness Center in Addis Ababa",
  description:
    "Get answers to common questions about ShapeUp Sport Zone - a dedicated fitness center in Sarbet, Addis Ababa. Learn about memberships, training programs, facilities, schedules, CrossFit classes, Muay Thai training, recovery services, and more.",
  openGraph: {
    title: "FAQ - ShapeUp Sport Zone Fitness Center",
    description:
      "Get answers to common questions about ShapeUp Sport Zone - a welcoming fitness center in Sarbet, Addis Ababa. Membership info, programs, facilities and more.",
  },
  twitter: {
    title: "FAQ - ShapeUp Sport Zone Fitness Center",
    description:
      "Get answers to common questions about ShapeUp Sport Zone - a welcoming fitness center in Sarbet, Addis Ababa. Membership info, programs, facilities and more.",
  },
};
