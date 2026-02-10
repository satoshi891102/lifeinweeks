import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lifeinweeks.vercel.app"),
  title: "Life in Weeks — Your Entire Life, Visualized",
  description: "See your life as a grid of weeks. ~4,000 tiny boxes. Each one a week you've lived or will live. Beautiful. Confronting. Motivating.",
  openGraph: {
    title: "Life in Weeks — Your Entire Life, Visualized",
    description: "~4,000 weeks. Each one a box. How many have you used?",
    url: "https://lifeinweeks.vercel.app",
    siteName: "Life in Weeks",
    type: "website",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Life in Weeks — Your Entire Life, Visualized",
    description: "~4,000 weeks. Each one a box. How many have you used?",
    images: ["/api/og"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[#fafafa] text-gray-900" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
