import { Hero } from "@/components/Hero";
import { Credibility } from "@/components/Credibility";
import { Outcomes } from "@/components/Outcomes";
import { FeaturedGallery } from "@/components/FeaturedGallery";
import { Approach } from "@/components/Approach";
import { SelectedWorks } from "@/components/SelectedWorks";
import { Expertise } from "@/components/Expertise";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Credibility />
      <FeaturedGallery />
      <Outcomes />
      <Approach />
      <SelectedWorks />
      <Expertise />
      <About />
      <Contact />
    </>
  );
}
