// app/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
// app/layout.tsx
import "./globals.css";
import "./styles/fonts.css";
import { Inter } from "next/font/google";
import { CartProvider } from "./Shop/_components/CartContext";
import { ServiceProvider } from "./admin/components/serviceContext";
import { Metadata, Viewport } from "next";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// Define base URL for absolute URLs in metadata
const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://shapeup.shalops.com";

// Move viewport to a separate export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "shape up fitness",
    template: "%s | shape up fitness",
  },
  description:
    "shape up fitness is a premier Health and Fitness Center in Addis, offering top-notch fitness services, personal training, and state-of-the-art facilities to help you achieve your fitness goals.",
  generator: "Next.js",
  applicationName: "shape up fitness",
  referrer: "origin-when-cross-origin",
  keywords: [
    "fitness",
    "gym",
    "personal training",
    "Addis",
    "workout",
    "health",
    "muscle building",
    "weight loss",
    "fitness center",
  ],
  authors: [{ name: "shape up fitness Team" }],
  creator: "shape up fitness",
  publisher: "shape up fitness",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      am: "/am",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "am_ET",
    url: baseUrl,
    siteName: "shape up fitness",
    title: "shape up fitness - Premier Fitness Center",
    description:
      "Transform your body and life at shape up fitness. Professional trainers, state-of-the-art equipment, and personalized programs for all fitness levels.",
    images: [
      {
        url: `${baseUrl}/assets/images/hero.jpeg`,
        width: 1200,
        height: 630,
        alt: "shape up fitness - Fitness Center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "shape up fitness - Premier Fitness Center",
    description:
      "Transform your body and life at shape up fitness. Professional trainers, state-of-the-art equipment, and personalized programs for all fitness levels.",
    images: [`${baseUrl}/assets/images/hero.jpeg`],
    creator: "@shape ups",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/Images/logo.png",
  },
  verification: {
    google: "google-site-verification-code", // Add your Google verification code here
    yandex: "yandex-verification-code", // Add your Yandex verification code if applicable
  },
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  return (
    <html lang={locale} dir={locale === "am" ? "ltr" : "ltr"}>
      <head>
        {/* Favicon is already included via metadata */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Preconnect to domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`font-jost ${inter.className}`}>
        <ServiceProvider>
          <CartProvider>
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </CartProvider>
        </ServiceProvider>

        {/* <div className="bg-black h-full">
          <h1 className="text-customBlue text-center ">
            {" "}
            Website Under Maintainance, please check back later.
          </h1>
        </div> */}
      </body>
    </html>
  );
}
