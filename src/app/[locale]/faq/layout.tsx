import { ReactNode } from "react";

interface FAQLayoutProps {
  children: ReactNode;
}

export default function FAQLayout({ children }: FAQLayoutProps) {
  return <>{children}</>;
}

export const metadata = {
  title: "FAQ - ShapeUp Fitness Center",
  description:
    "Find answers to frequently asked questions about ShapeUp Fitness Center, memberships, training programs, and facilities.",
};
