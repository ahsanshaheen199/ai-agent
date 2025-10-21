import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { TanstackQueryProvider } from "@/context/tanstack-query-provider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/context/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Agent",
    template: "%s | AI Agent",
  },
  description: "AI agent application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistSans.className} antialiased`}
      >
        <TanstackQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-right" />
          </ThemeProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
