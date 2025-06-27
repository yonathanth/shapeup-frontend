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
  process.env.NEXT_PUBLIC_BASE_URL || "https://shapeupsportzone.com";

// Move viewport to a separate export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "ShapeUp Sport Zone - Premium Fitness Center in Addis Ababa",
    template: "%s | ShapeUp Sport Zone",
  },
  description:
    "ShapeUp Sport Zone is Addis Ababa's premier fitness destination offering world-class gym equipment, expert personal training, CrossFit, Muay Thai, kickboxing, sports courts, recovery facilities, and nutrition guidance. Transform your fitness journey with Ethiopia's most advanced training center.",
  generator: "Next.js",
  applicationName: "ShapeUp Sport Zone",
  referrer: "origin-when-cross-origin",
  keywords: [
    "ShapeUp Sport Zone",
    "premium gym Addis Ababa",
    "fitness center Ethiopia",
    "CrossFit Addis Ababa",
    "Muay Thai training",
    "kickboxing classes",
    "personal trainer Ethiopia",
    "strength training",
    "sports courts Addis",
    "recovery center",
    "steam bath Ethiopia",
    "ice bath therapy",
    "juice bar gym",
    "women only fitness",
    "professional gym equipment",
    "fitness transformation",
    "Sarbet gym",
    "Ethiopian fitness",
    "workout classes",
    "bodybuilding gym",
  ],
  authors: [{ name: "ShapeUp Sport Zone Team" }],
  creator: "ShapeUp Sport Zone",
  publisher: "ShapeUp Sport Zone",
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
    url: baseUrl,
    siteName: "ShapeUp Sport Zone",
    title:
      "ShapeUp Sport Zone - Premium Fitness Center in Addis Ababa, Ethiopia",
    description:
      "Experience Ethiopia's most advanced fitness facility at ShapeUp Sport Zone. Located in Sarbet, Addis Ababa, we offer premium gym equipment, expert training in CrossFit, Muay Thai, kickboxing, professional sports courts, recovery facilities with steam & ice baths, and personalized nutrition guidance. Join 200+ active members on their transformation journey.",
    images: [
      {
        url: `${baseUrl}/Images/logo.png`,
        width: 1200,
        height: 630,
        alt: "ShapeUp Sport Zone - Premium Fitness Center in Addis Ababa",
      },
      {
        url: `${baseUrl}/assets/heroImages/four.jpg`,
        width: 1200,
        height: 630,
        alt: "ShapeUp Sport Zone Gym Floor - State of the Art Equipment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShapeUp Sport Zone - Premium Fitness Center in Addis Ababa",
    description:
      "Transform your fitness at Ethiopia's premier training facility. Premium equipment, expert trainers, CrossFit, Muay Thai, sports courts & recovery facilities in Sarbet, Addis Ababa.",
    images: [`${baseUrl}/Images/logo.png`],
    creator: "@ShapeUpSportZone",
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
