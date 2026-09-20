import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Booking } from "@/components/sections/Booking";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Location } from "@/components/sections/Location";
import { Nav } from "@/components/sections/Nav";
import { Newsletter } from "@/components/sections/Newsletter";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Services />
        <BeforeAfter />
        <Booking />
        <Location />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
