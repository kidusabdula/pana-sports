import { Outfit, DM_Mono } from "next/font/google";
import "./global.css";
import QueryClientProvider from "@/components/providers/query-client-provider";
import AppShell from "@/components/shared/AppShell";
import { Toaster } from "sonner";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });
const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500"],
});

export const metadata = {
  title: "Pana Sports",
  description: "Ethiopian Football Hub",
  icons: {
    icon: "/logo2.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${dmMono.variable} font-sans flex flex-col min-h-screen`}
      >
        <QueryClientProvider>
          <AppShell>{children}</AppShell>
        </QueryClientProvider>
        <Toaster position="top-right" expand={true} richColors closeButton />
      </body>
    </html>
  );
}
