import { Hero } from "@/components/Hero";
import { Hero_V2 } from "@/components/Hero_V2";
import { Credibility } from "@/components/Credibility";
import { Outcomes } from "@/components/Outcomes";
import { Leadership } from "@/components/Leadership";
import { FeaturedGallery } from "@/components/FeaturedGallery";
import { NowBuilding } from "@/components/NowBuilding";
import { Approach } from "@/components/Approach";
import { SelectedWorks } from "@/components/SelectedWorks";
import { SelectedWorks_V2 } from "@/components/SelectedWorks_V2";
import { Expertise } from "@/components/Expertise";
import { About } from "@/components/About";
import { About_V2 } from "@/components/About_V2";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <>
      {/* <Hero /> */}
      <Hero_V2 />
      <Credibility />
      <FeaturedGallery />
      <NowBuilding />
      <Outcomes />
      <Leadership />
      <Approach />
      {/* <SelectedWorks /> */}
      <SelectedWorks_V2 />
      <Expertise />
      {/* <About /> */}
      <About_V2 />
      <Contact />
    </>
  );
}
