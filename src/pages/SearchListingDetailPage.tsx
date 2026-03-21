import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { getSearchCatalogBySlug } from "@/data/searchCatalogProperties";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const SearchListingDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const property = slug ? getSearchCatalogBySlug(slug) : undefined;

  useDocumentTitle(property ? `Sav Zaman UK — ${property.title}` : "Sav Zaman UK — Property");

  if (!property) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Listing not found</h1>
        <Link to="/properties" className="mt-6 inline-block text-blue-600 underline">
          Back to search
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 pt-8">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <Link
          to="/properties"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to results
        </Link>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="relative aspect-[21/9] max-h-[420px]">
            <img src={property.image} alt="" className="h-full w-full object-cover" />
            {property.featured ? (
              <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-3 py-1 text-xs font-bold uppercase text-white">
                Featured
              </span>
            ) : null}
          </div>
          <div className="p-6 md:p-8">
            <p className="text-3xl font-bold tracking-tight text-slate-900">{property.priceDisplay}</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-800">{property.title}</h1>
            <p className="mt-3 flex items-center gap-2 text-slate-600">
              <MapPin className="h-5 w-5 text-blue-600" />
              {property.location}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium">{property.propertyType}</span>
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium">{property.sector}</span>
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm">
                {property.bedrooms === 0 ? "Beds N/A" : `${property.bedrooms} bedrooms`}
              </span>
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm">{property.area}</span>
              <span
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold text-white ${
                  property.listingType === "Rent" ? "bg-teal-600" : property.listingType === "Sold" ? "bg-slate-600" : "bg-blue-600"
                }`}
              >
                {property.listingType}
              </span>
            </div>
            <p className="mt-6 text-sm text-slate-500">Listed by {property.agent}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/contact?ref=${encodeURIComponent(property.slug)}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 px-6 py-3.5 font-semibold text-white transition hover:brightness-110"
              >
                <Phone className="h-5 w-5" />
                Contact agent
              </Link>
              <Link
                to="/properties"
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                View similar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SearchListingDetailPage;
