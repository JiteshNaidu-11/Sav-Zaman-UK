import { useEffect, useRef } from "react";

const MarqueeBanner = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    let animationId: number;
    let position = 0;

    const animate = () => {
      position += 1;
      const scrollWidth = marquee.scrollWidth / 2;
      
      if (position > scrollWidth) {
        position = 0;
      }
      
      marquee.style.transform = `translateX(-${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section className="bg-accent py-4 overflow-hidden">
      <div 
        ref={marqueeRef}
        className="flex whitespace-nowrap"
      >
        <div className="flex animate-marquee">
          <span className="text-accent-foreground text-lg md:text-xl font-semibold px-8 min-w-max">
            New Flats - 1 | 2 | 3 | 4 | 5 BHK Flats, Resale Or New Are Available. Location - Mahatmanagar, Gangapurroad, Indiranagar
          </span>
          <span className="text-accent-foreground text-lg md:text-xl font-semibold px-8 min-w-max">
            New Flats - 1 | 2 | 3 | 4 | 5 BHK Flats, Resale Or New Are Available. Location - Mahatmanagar, Gangapurroad, Indiranagar
          </span>
        </div>
      </div>
    </section>
  );
};

export default MarqueeBanner;
