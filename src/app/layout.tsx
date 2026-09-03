import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import { portfolio } from "@/data/portfolio";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${portfolio.personal.name} — Software Developer`,
  description: portfolio.personal.tagline,
};

/**
 * Applies the stored theme before first paint, so a dark-mode visitor never
 * sees a white flash. Must run blocking in <head> — an effect runs too late.
 * The storage key here has to stay in sync with Header.tsx.
 */
const themeScript = `
try {
  var stored = localStorage.getItem("theme");
  var dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", dark);
} catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col" id="top">
        <Header />
        {/* Offset for the fixed h-16 header. */}
        <div className="flex flex-1 flex-col pt-16">{children}</div>
      </body>
    </html>
  );
}
