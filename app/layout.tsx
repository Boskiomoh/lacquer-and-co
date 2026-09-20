import type { Metadata, Viewport } from "next";
import { Barlow, Chivo, Roboto_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { site } from "@/lib/site";
import "./globals.css";

const chivo = Chivo({ variable: "--font-chivo", subsets: ["latin"], display: "swap" });
const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
// Mono only sets prices and references; it should not compete with the hero image.
const robotoMono = Roboto_Mono({ variable: "--font-roboto-mono", subsets: ["latin"], display: "swap", preload: false });

const description =
  "Hand detailing, paint correction and ceramic coating from a small Chicago workshop. Fixed prices, online booking.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Lacquer & Co. | Auto detailing and paint correction, Chicago",
    template: "%s | Lacquer & Co.",
  },
  description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Lacquer & Co. | Your car, returned better than delivered",
    description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f3f2f0",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${chivo.variable} ${barlow.variable} ${robotoMono.variable} antialiased`}>
      <body>
        <a
          href="#main"
          className="fixed left-4 top-4 z-50 -translate-y-24 rounded-full bg-ink px-5 py-3 font-semibold text-white transition-transform focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
