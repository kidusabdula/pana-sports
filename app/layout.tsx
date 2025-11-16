// app/layout.tsx
import type { Metadata } from "next";
import { Inter, DM_Mono } from "next/font/google";
import "./globals.css";
import QueryClientProvider from "@/components/providers/query-client-provider";

const inter = Inter({ subsets: ["latin"] });
const dmMono = DM_Mono({ 
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
  title: "Pana Sports",
  description: "Ethiopian Football Hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${dmMono.variable}`}>
        <QueryClientProvider>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}