import { ReactNode } from "react";

interface FAQLayoutProps {
  children: ReactNode;
}

export default function FAQLayout({ children }: FAQLayoutProps) {
  return <>{children}</>;
}

export const metadata = {
  title: "FAQ - ShapeUp Sport Zone | Frequently Asked Questions",
  description:
    "Get answers to common questions about ShapeUp Sport Zone - Addis Ababa's premier fitness center. Learn about memberships, training programs, facilities, schedules, CrossFit classes, Muay Thai training, recovery services, and more.",
  openGraph: {
    title: "FAQ - ShapeUp Sport Zone Addis Ababa",
    description:
      "Get answers to common questions about ShapeUp Sport Zone - Ethiopia's premier fitness center in Sarbet, Addis Ababa. Membership info, programs, facilities and more.",
  },
  twitter: {
    title: "FAQ - ShapeUp Sport Zone Addis Ababa",
    description:
      "Get answers to common questions about ShapeUp Sport Zone - Ethiopia's premier fitness center in Sarbet, Addis Ababa. Membership info, programs, facilities and more.",
  },
};
