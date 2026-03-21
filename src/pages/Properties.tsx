import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { HomePropertiesSection } from "@/components/property-browse/HomePropertiesSection";
import { PropertiesPageDocumentTitle } from "@/components/property-browse/PropertiesPageDocumentTitle";
import { PropertyBrowseURLSync } from "@/components/PropertyBrowseURLSync";
import CTABanner from "@/components/CTABanner";

const Properties = () => (
  <main className="overflow-hidden">
    <PropertyBrowseURLSync />
    <PropertiesPageDocumentTitle />
    <section className="page-shell relative overflow-hidden pb-16 pt-24 md:pb-20 md:pt-32">
      <div className="hero-noise absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.24),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.14),transparent_30%)]" />

      <div className="container-custom relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <AnimatedSection>
            <span className="pill-tag">Property collection</span>
            <h1 className="mt-6 font-heading text-5xl font-semibold leading-[0.96] tracking-[-0.03em] text-white md:text-6xl">
              Browse Sav Zaman UK listings with live filters, sort, and map view.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/72 md:text-lg">
              Start from the homepage search to land here with your criteria, or refine location, listing type, sector,
              radius, and price — then sort, switch map view, and shortlist without leaving this page.
            </p>
          </AnimatedSection>
        </motion.div>
      </div>
    </section>

    <HomePropertiesSection showIntroHeading={false} className="pt-4 md:pt-6" />

    <CTABanner />
  </main>
);

export default Properties;
