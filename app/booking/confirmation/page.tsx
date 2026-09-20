import type { Metadata } from "next";
import { Suspense } from "react";
import { ConfirmationView } from "@/components/booking/ConfirmationView";
import { DraftProvider } from "@/components/booking/DraftContext";
import { Footer } from "@/components/sections/Footer";
import { Nav } from "@/components/sections/Nav";

export const metadata: Metadata = {
  title: "Your booking",
  robots: { index: false },
};

export default function ConfirmationPage() {
  return (
    <>
      <Nav />
      <main id="main" className="section-y">
        <div className="container-page max-w-[760px]">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-(--radius-panel) bg-surface-alt" />}>
            <DraftProvider>
              <ConfirmationView />
            </DraftProvider>
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
