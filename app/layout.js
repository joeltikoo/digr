import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "./ThemeProvider"; 
import { ThemeToggle } from "../components/ThemeToggle"; 
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DIGR — find underground music you've never heard of",
  description: "Describe a vibe, drop some artists you like, and DIGR finds underground artists the algorithm never shows you.",
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased bg-white dark:bg-zinc-950 text-black dark:text-white transition-colors duration-300">
        
        <ThemeProvider>
          {/* This puts the button in the top right corner */}
          <div className="absolute top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          
          {children}
          
        </ThemeProvider>

      </body>
    </html>
  );
}