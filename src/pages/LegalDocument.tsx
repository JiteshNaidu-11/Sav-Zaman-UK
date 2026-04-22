import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { siteDocumentTitle } from "@/content/site";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const DOCS = {
  "privacy-policy": {
    title: "Privacy Policy",
    body:
      "Sav Zaman respects your privacy. This page outlines how we may collect, use, and protect personal information when you enquire about properties or use our services. For full details or questions, contact us at the email below.",
  },
  "terms-of-use": {
    title: "Terms of Use",
    body:
      "By using this website you agree to these terms. Content is for information only and does not constitute legal or financial advice. Listings and availability may change; always confirm details directly with us before relying on them.",
  },
  cookies: {
    title: "Cookies",
    body:
      "We may use cookies and similar technologies to improve site performance and understand how visitors use our pages. You can control cookies through your browser settings. Contact us if you need more information.",
  },
} as const;

export type LegalSlug = keyof typeof DOCS;

type Props = { slug: LegalSlug };

const LegalDocument = ({ slug }: Props) => {
  const doc = DOCS[slug];
  useDocumentTitle(`${siteDocumentTitle} — ${doc.title}`);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>
      <h1 className="mt-8 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{doc.title}</h1>
      <p className="mt-6 text-base leading-7 text-muted-foreground">{doc.body}</p>
      <p className="mt-8 text-sm text-muted-foreground">
        Questions?{" "}
        <a href="mailto:info@savzamanproperties.com" className="text-blue-600 hover:underline">
          info@savzamanproperties.com
        </a>
      </p>
    </main>
  );
};

export default LegalDocument;
