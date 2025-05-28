import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | shape up fitness",
  description:
    "Explore our range of fitness services including personal training, group fitness, bodybuilding, and more at shape up fitness.",
  openGraph: {
    title: "Fitness Services | shape up fitness",
    description:
      "From personalized training to group fitness classes, discover the right program for your fitness journey at shape up fitness.",
  },
  twitter: {
    title: "Fitness Services | shape up fitness",
    description:
      "From personalized training to group fitness classes, discover the right program for your fitness journey at shape up fitness.",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
