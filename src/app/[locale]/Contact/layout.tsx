import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | shape up fitness",
  description:
    "Get in touch with shape up fitness. Find our locations, contact information, and send us your feedback or inquiries.",
  openGraph: {
    title: "Contact shape up fitness | Get in Touch With Our Team",
    description:
      "Reach out to our team for any questions about memberships, classes, or facilities. We're here to help you on your fitness journey.",
  },
  twitter: {
    title: "Contact shape up fitness | Get in Touch With Our Team",
    description:
      "Reach out to our team for any questions about memberships, classes, or facilities. We're here to help you on your fitness journey.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
