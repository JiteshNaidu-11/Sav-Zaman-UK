import { MapPin, MessageCircle, Phone, Mail } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import CTABanner from "@/components/CTABanner";
import { EnquiryFormBody } from "@/components/EnquiryFormBody";
import { contactHighlights, siteContent } from "@/content/site";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

function normalizeWhatsAppNumber(value: string): string {
  return value.replace(/\(0\)/g, "").replace(/\D/g, "");
}

const mapEmbedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(siteContent.address)}&output=embed`;

const Contact = () => {
  useDocumentTitle("Sav Zaman UK — Contact");
  const normalized = normalizeWhatsAppNumber(siteContent.whatsappNumber ?? siteContent.phone);
  const whatsappHref = normalized ? `https://wa.me/${normalized}` : `mailto:${siteContent.email}`;

  return (
    <main className="overflow-hidden">
      <section className="page-shell relative overflow-hidden py-24 md:py-28 pb-32 md:pb-40">
        <div className="hero-noise absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.24),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.14),transparent_28%)]" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <AnimatedSection className="max-w-2xl">
            <span className="pill-tag">Contact</span>
            <h1 className="mt-6 font-heading text-5xl font-semibold leading-[0.96] tracking-[-0.03em] text-white md:text-6xl">
              Start the property conversation with a clearer brief and a stronger next step.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/72 md:text-lg">
              Whether you are buying, selling, booking a viewing, or exploring an investment opportunity, Sav Zaman UK is ready to hear the brief.
            </p>
          </AnimatedSection>

          <AnimatedSection direction="left">
            <div className="grid gap-4 md:grid-cols-3">
              {contactHighlights.map((item) => (
                <div key={item.title} className="rounded-[24px] border border-white/8 bg-white/[0.05] p-5 backdrop-blur-xl">
                  <h2 className="font-heading text-2xl text-white">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/64">{item.description}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative z-20 -mt-20 bg-[hsl(var(--background))] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-10 -translate-y-12 md:-translate-y-20">
            <AnimatedSection>
              <div className="flex h-full flex-col gap-8 rounded-2xl border border-white/10 bg-[#0B1A2F] p-6 text-white shadow-xl md:p-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Office</p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold">Visit or reach us directly</h2>
                </div>

              <div className="flex gap-3 text-sm leading-relaxed text-white/85">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-teal-300" />
                <span>{siteContent.address}</span>
              </div>

              <div className="space-y-4">
                <a href={`mailto:${siteContent.email}`} className="flex items-center gap-3 text-sm text-white/90 transition hover:text-white">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <Mail className="h-5 w-5 text-teal-300" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-white/45">Email</span>
                    {siteContent.email}
                  </span>
                </a>
                <a
                  href={`tel:${siteContent.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3 text-sm text-white/90 transition hover:text-white"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <Phone className="h-5 w-5 text-teal-300" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-white/45">Phone</span>
                    {siteContent.phone}
                  </span>
                </a>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/45">Working hours</p>
                <p className="mt-1 text-sm text-white/90">{siteContent.hours}</p>
              </div>

              <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
                <iframe
                  title="Office location map"
                  src={mapEmbedSrc}
                  className="h-56 w-full border-0 grayscale-[0.2] contrast-[1.05] sm:h-64"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <a
                href={whatsappHref}
                target={whatsappHref.startsWith("http") ? "_blank" : undefined}
                rel={whatsappHref.startsWith("http") ? "noreferrer" : undefined}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-105"
              >
                <MessageCircle className="h-5 w-5" />
                Chat on WhatsApp
              </a>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="left">
              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xl md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Enquiry</p>
                <h2 className="mt-2 font-heading text-2xl font-semibold text-foreground">Send message</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Use the same enquiry form as across the site — property details can be added in the property field if relevant.
                </p>
                <div className="mt-8">
                  <EnquiryFormBody
                    formKey="contact-page"
                    prefill={{ defaultEnquiryType: "General Enquiry" }}
                    submitLabel="Send Message"
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="mt-20">
        <CTABanner />
      </div>
    </main>
  );
};

export default Contact;
