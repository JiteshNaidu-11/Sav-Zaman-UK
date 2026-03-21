import AnimatedSection from "./AnimatedSection";

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}

const SectionHeading = ({ label, title, subtitle, center = true, light = false }: SectionHeadingProps) => {
  return (
    <AnimatedSection className={`mb-12 md:mb-16 ${center ? "text-center" : ""}`}>
      {label && (
        <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">
          {label}
        </span>
      )}
      <h2 className={`heading-section ${light ? "text-primary-foreground" : "text-foreground"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`subtitle mt-4 max-w-2xl ${center ? "mx-auto" : ""} ${light ? "text-primary-foreground/70" : ""}`}>
          {subtitle}
        </p>
      )}
    </AnimatedSection>
  );
};

export default SectionHeading;
