import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BORDER_COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

const partners = [
  { src: "/member brand 1.png", name: "Member Brand 1" },
  { src: "/member brand 2.png", name: "Member Brand 2" },
  { src: "/member brand 3.png", name: "Member Brand 3" },
];

const PartnersSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % partners.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section-padding bg-background">
      <div className="container-custom text-center">
        <motion.h2
          className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-10 md:mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
        >
          Trusted by Nashik&apos;s leading brands
        </motion.h2>

        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 items-center justify-items-center">
            {partners.map((partner, index) => {
              const isActive = index === activeIndex;
              return (
                <motion.div
                  key={partner.name}
                  animate={{
                    scale: isActive ? 1 : 0.9,
                    y: isActive ? -6 : 6,
                    opacity: isActive ? 1 : 0.75,
                  }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="relative"
                >
                  <div
                    className="w-28 h-28 md:w-40 md:h-40 rounded-full p-[4px] shadow-lg"
                    style={{
                      background: `conic-gradient(from 180deg, ${BORDER_COLORS[index]} 0deg, rgba(255,255,255,0.7) 110deg, ${BORDER_COLORS[index]} 360deg)`,
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-white/90 backdrop-blur-sm p-3 md:p-4 overflow-hidden">
                      <img
                        src={partner.src}
                        alt={partner.name}
                        className="w-full h-full object-contain object-center"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
