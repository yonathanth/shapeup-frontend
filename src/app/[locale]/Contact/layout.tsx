import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact ShapeUp Sport Zone - Fitness Center in Addis Ababa",
  description:
    "Contact ShapeUp Sport Zone - a dedicated fitness center in Sarbet, Addis Ababa. Get membership information, class schedules, facility tours, and fitness consultation. Call 0944221314 or email shapeup162@gmail.com. Open 5AM-9PM Mon-Sat, 7AM-1PM Sunday.",
  openGraph: {
    title: "Contact ShapeUp Sport Zone - Fitness Center Addis Ababa",
    description:
      "Get in touch with ShapeUp Sport Zone for membership information, facility tours, and fitness consultation. Located in Sarbet, Addis Ababa. Our team is ready to help start your fitness journey.",
  },
  twitter: {
    title: "Contact ShapeUp Sport Zone - Fitness Center Addis Ababa",
    description:
      "Get in touch with ShapeUp Sport Zone for membership information, facility tours, and fitness consultation. Located in Sarbet, Addis Ababa. Our team is ready to help start your fitness journey.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
