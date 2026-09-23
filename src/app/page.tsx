import { Hero } from "@/components/Hero";
import { Credibility } from "@/components/Credibility";
import { Outcomes } from "@/components/Outcomes";
import { Leadership } from "@/components/Leadership";
import { FeaturedGallery } from "@/components/FeaturedGallery";
import { NowBuilding } from "@/components/NowBuilding";
import { Approach } from "@/components/Approach";
import { SelectedWorks } from "@/components/SelectedWorks";
import { Expertise } from "@/components/Expertise";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <div className="flex flex-col gap-24 py-24 px-6 md:px-12 lg:px-24">
      <section id="hero">
        <Hero />
      </section>

      <section id="work">
        <div className="flex flex-col gap-12">
          <div className="eyebrow">Selected Works</div>
          <FeaturedGallery />
        </div>
      </section>

      <section id="experience">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col gap-12">
             <Credibility />
             <Outcomes />
          </div>
          <div className="flex flex-col gap-12">
             <Leadership />
             <Approach />
          </div>
        </div>
      </section>

      <section id="more-work">
        <div className="flex flex-col gap-12">
          <div className="eyebrow">Other Projects</div>
          <SelectedWorks />
          <NowBuilding />
        </div>
      </section>

      <section id="about">
        <div className="flex flex-col gap-12">
          <Expertise />
          <About />
        </div>
      </section>

      <section id="contact">
        <Contact />
      </section>
    </div>
  );
}
