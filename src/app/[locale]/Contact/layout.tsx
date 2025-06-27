import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact ShapeUp Sport Zone - Get in Touch | Sarbet, Addis Ababa",
  description:
    "Contact ShapeUp Sport Zone - Ethiopia's premier fitness center in Sarbet, Addis Ababa. Get membership information, class schedules, facility tours, and expert fitness consultation. Call 0944221314 or email shapeup162@gmail.com. Open 5AM-9PM Mon-Sat, 7AM-1PM Sunday.",
  openGraph: {
    title: "Contact ShapeUp Sport Zone - Premium Fitness Center Addis Ababa",
    description:
      "Get in touch with ShapeUp Sport Zone for membership information, facility tours, and expert fitness consultation. Located in Sarbet, Addis Ababa. Professional team ready to help start your fitness transformation.",
  },
  twitter: {
    title: "Contact ShapeUp Sport Zone - Premium Fitness Center Addis Ababa",
    description:
      "Get in touch with ShapeUp Sport Zone for membership information, facility tours, and expert fitness consultation. Located in Sarbet, Addis Ababa. Professional team ready to help start your fitness transformation.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
