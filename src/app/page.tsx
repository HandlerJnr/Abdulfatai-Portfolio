import { Hero } from "@/components/Hero";
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
      <FeaturedGallery />
      <Approach />
      <SelectedWorks />
      <Expertise />
      <About />
      <Contact />
    </>
  );
}
