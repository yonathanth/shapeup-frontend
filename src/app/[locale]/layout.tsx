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
    default: "ShapeUp Sport Zone - Fitness Center in Addis Ababa",
    template: "%s | ShapeUp Sport Zone",
  },
  description:
    "ShapeUp Sport Zone is a dedicated fitness center in Sarbet, Addis Ababa offering quality gym equipment, personal training, CrossFit, Muay Thai, kickboxing, sports courts, recovery facilities, and nutrition guidance. Join our supportive community and work toward your fitness goals.",
  generator: "Next.js",
  applicationName: "ShapeUp Sport Zone",
  referrer: "origin-when-cross-origin",
  keywords: [
    "ShapeUp Sport Zone",
    "gym in Addis Ababa",
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
    "quality gym equipment",
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
    title: "ShapeUp Sport Zone - Fitness Center in Addis Ababa, Ethiopia",
    description:
      "A welcoming fitness center in Sarbet, Addis Ababa. We offer quality gym equipment, experienced training in CrossFit, Muay Thai, kickboxing, sports courts, recovery facilities with steam & ice baths, and nutrition guidance. Join our growing community of fitness enthusiasts.",
    images: [
      {
        url: `${baseUrl}/Images/logo.png`,
        width: 1200,
        height: 630,
        alt: "ShapeUp Sport Zone - Fitness Center in Addis Ababa",
      },
      {
        url: `${baseUrl}/assets/heroImages/four.jpg`,
        width: 1200,
        height: 630,
        alt: "ShapeUp Sport Zone Gym Floor - Quality Equipment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShapeUp Sport Zone - Fitness Center in Addis Ababa",
    description:
      "Work toward your fitness goals at our dedicated training facility. Quality equipment, experienced trainers, CrossFit, Muay Thai, sports courts & recovery facilities in Sarbet, Addis Ababa.",
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
