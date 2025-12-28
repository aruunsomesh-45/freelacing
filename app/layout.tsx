import type { Metadata } from "next";
import Script from "next/script";


import { Inter, Outfit, Orbitron, Michroma } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import FloatingContact from "@/components/FloatingContact";
import { VoiceAgentProvider } from "@/context/VoiceAgentContext";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const michroma = Michroma({
  weight: "400",
  variable: "--font-michroma",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://andrea-creations.com'),
  title: "Andrea | Premium Digital Product Designer & Developer",
  description: "Specializing in results-driven web development, UI/UX design, and scalable digital solutions for brands that demand the best.",
  openGraph: {
    title: "Andrea | Premium Digital Product Designer & Developer",
    description: "Results-driven web development & UI/UX for future-ready brands.",
    url: "https://andrea-creations.com",
    siteName: "Andrea Digital",
    images: [
      {
        url: "/hero-poster.png",
        width: 1200,
        height: 630,
        alt: "Andrea Digital Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${outfit.variable} ${orbitron.variable} ${michroma.variable} antialiased font-sans bg-black text-neutral-50 flex flex-col min-h-screen`}
      >
        <VoiceAgentProvider>
          {process.env.NODE_ENV === 'production' && (
            <>
              <Script
                src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
                defer
              />
              <Script id="onesignal-init">
                {`
                window.OneSignalDeferred = window.OneSignalDeferred || [];
                OneSignalDeferred.push(async function(OneSignal) {
                  await OneSignal.init({
                    appId: "525b12bc-498e-4b08-8ed6-0531081dae6c",
                  });
                });
              `}
              </Script>
            </>
          )}

          {/* Chatling Chatbot - loads in all environments */}
          <Script id="chatling-config" strategy="afterInteractive">
            {`window.chtlConfig = { chatbotId: "1399234149" }`}
          </Script>
          <Script
            src="https://chatling.ai/js/embed.js"
            data-id="1399234149"
            id="chtl-script"
            strategy="afterInteractive"
          />

          <SmoothScroll />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <FloatingContact />
          <Footer />
        </VoiceAgentProvider>
      </body>
    </html>


  );
}
