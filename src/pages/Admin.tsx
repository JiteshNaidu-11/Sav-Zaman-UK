import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { type Session } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Eye,
  HousePlus,
  ImagePlus,
  Images,
  Mail,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  PencilLine,
  PlayCircle,
  RefreshCcw,
  Search,
  Sparkles,
  Star,
  TableProperties,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import AnimatedSection from "@/components/AnimatedSection";
import { getShowSellHouseSection, setShowSellHouseSection } from "@/lib/uiFlags";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Property,
  createPropertySlug,
  normalizeVideoEmbedUrl,
  propertyDetailPath,
  propertyCategories,
  propertyListingTypes,
  propertyStatuses,
} from "@/data/properties";
import { usePropertyStore } from "@/context/PropertyStoreContext";
import { propertyImagesBucket, supabase, supabaseConfigured } from "@/lib/supabase";

interface PropertyFormState {
  slug: string;
  title: string;
  location: string;
  address: string;
  price: string;
  type: string;
  area: string;
  beds: string;
  baths: string;
  category: string;
  overview: string;
  amenitiesText: string;
  status: string;
  featured: boolean;
  heroFeatured: boolean;
  image: string;
  uploadedPrimaryImage: string;
  galleryText: string;
  uploadedGalleryImages: string[];
  videoUrl: string;
}

const createEmptyForm = (): PropertyFormState => ({
  slug: "",
  title: "",
  location: "",
  address: "",
  price: "",
  type: "For Sale",
  area: "",
  beds: "",
  baths: "",
  category: "Residential",
  overview: "",
  amenitiesText: "",
  status: "For Sale",
  featured: false,
  heroFeatured: false,
  image: "",
  uploadedPrimaryImage: "",
  galleryText: "",
  uploadedGalleryImages: [],
  videoUrl: "",
});

type PriceCurrency = "GBP" | "USD" | "EUR";

const PRICE_CURRENCIES: { code: PriceCurrency; label: string }[] = [
  { code: "GBP", label: "GBP (£)" },
  { code: "USD", label: "USD ($)" },
  { code: "EUR", label: "EUR (€)" },
];

type AreaUnit = "Sqft" | "Sqyd" | "Sqm" | "Acres" | "Hectares";

const AREA_UNITS: { value: AreaUnit; label: string }[] = [
  { value: "Sqft", label: "Sqft" },
  { value: "Sqyd", label: "Sq yd" },
  { value: "Sqm", label: "Sqm" },
  { value: "Acres", label: "Acres" },
  { value: "Hectares", label: "Hectares" },
];

function parseArea(area: string): { numberPart: string; unit: AreaUnit } {
  const trimmed = String(area || "").trim();
  if (!trimmed) return { numberPart: "", unit: "Sqft" };
  const match = trimmed.match(/^([\d,.\s]+)\s*([a-zA-Z]+)?$/);
  const rawNumber = (match?.[1] ?? trimmed).replace(/[^\d.]/g, "");
  const rawUnit = (match?.[2] ?? "").trim().toLowerCase();
  const unit =
    rawUnit === "sqyd" || rawUnit === "sqy" || rawUnit === "yd2" || rawUnit === "yd" || rawUnit === "yards"
      ? "Sqyd"
      : rawUnit === "sqm"
        ? "Sqm"
        : rawUnit === "acres" || rawUnit === "acre"
          ? "Acres"
          : rawUnit === "hectares" || rawUnit === "hectare" || rawUnit === "ha"
            ? "Hectares"
            : "Sqft";
  return { numberPart: rawNumber, unit };
}

function buildArea(numberPart: string, unit: AreaUnit): string {
  const digits = String(numberPart || "").replace(/[^\d.]/g, "");
  if (!digits) return "";
  const formatted = digits.includes(".") ? digits : formatNumberWithCommas(digits);
  return `${formatted} ${unit}`;
}

const BED_OPTIONS: string[] = Array.from({ length: 99 }, (_, idx) => idx + 1)
  .flatMap((n) => (n >= 50 ? [n] : [n, Number(`${n}.5`)]))
  .filter((v) => (typeof v === "number" ? v <= 50 : true))
  .map((v) => `${v} BHK`);

const BATH_OPTIONS: string[] = Array.from({ length: 10 }, (_, idx) => String(idx + 1));

const AMENITY_OPTIONS: readonly string[] = [
  "Security",
  "CCTV Surveillance",
  "Power Backup",
  "Lift",
  "Reserved Parking",
  "Visitor Parking",
  "Gated Community",
  "Club House",
  "Gym",
  "Swimming Pool",
  "Children's Play Area",
  "Garden",
  "Modular Kitchen",
  "Vastu Compliant",
  "Water Supply",
  "Fire Safety",
  "Near School",
  "Near Hospital",
  "Near Market",
  "Corner Plot",
  "Main Road Facing",
  "Loan Assistance",
  "Rent Agreement Support",
] as const;

function formatNumberWithCommas(rawDigits: string): string {
  const cleaned = rawDigits.replace(/[^\d]/g, "");
  if (!cleaned) return "";
  // Remove leading zeros but keep a single "0" if the value is zero.
  const normalized = cleaned.replace(/^0+(?=\d)/, "");
  return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function splitPriceValue(price: string): { currency: PriceCurrency; numberPart: string } {
  const trimmed = String(price || "").trim();
  const match = trimmed.match(/^(GBP|USD|EUR)\s+(.*)$/i);
  if (match) {
    const currency = match[1].toUpperCase() as PriceCurrency;
    const numberPart = match[2] ?? "";
    return { currency, numberPart };
  }
  return { currency: "GBP", numberPart: trimmed };
}

function buildPrice(currency: PriceCurrency, numberPart: string): string {
  const formatted = formatNumberWithCommas(numberPart);
  return formatted ? `${currency} ${formatted}` : "";
}

function isDataImageSource(value?: string): boolean {
  return Boolean(value?.startsWith("data:image/"));
}

function propertyToForm(property: Property): PropertyFormState {
  return {
    slug: property.slug,
    title: property.title,
    location: property.location,
    address: property.address,
    price: property.price,
    type: property.type,
    area: property.area,
    beds: property.beds ?? "",
    baths: property.baths ?? "",
    category: property.category,
    overview: property.overview,
    amenitiesText: property.amenities.join("\n"),
    status: property.status,
    featured: Boolean(property.featured),
    heroFeatured: Boolean(property.heroFeatured),
    image: isDataImageSource(property.image) ? "" : property.image,
    uploadedPrimaryImage: isDataImageSource(property.image) ? property.image : "",
    galleryText: property.gallery.filter((image) => !isDataImageSource(image)).join("\n"),
    uploadedGalleryImages: property.gallery.filter((image) => isDataImageSource(image)),
    videoUrl: property.videoEmbedUrl ?? "",
  };
}

function parseMultiline(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Could not read file."));
    };
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not process image."));
    image.src = source;
  });
}

async function optimizeImageFile(file: File): Promise<string> {
  const dataUrl = await readFileAsDataUrl(file);

  try {
    const image = await loadImage(dataUrl);
    const maxDimension = 1600;
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return dataUrl;
    }

    canvas.width = width;
    canvas.height = height;
    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/webp", 0.82);
  } catch {
    return dataUrl;
  }
}

async function uploadDataUrlImage(dataUrl: string): Promise<string> {
  if (!supabaseConfigured || !supabase) {
    return dataUrl;
  }

  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const extension = blob.type.includes("png") ? "png" : blob.type.includes("jpeg") ? "jpg" : "webp";
  const filePath = `properties/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(propertyImagesBucket).upload(filePath, blob, {
    contentType: blob.type,
    upsert: false,
  });

  if (error) {
    throw error;
  }

  return supabase.storage.from(propertyImagesBucket).getPublicUrl(filePath).data.publicUrl;
}

const Admin = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { properties, loading, upsertProperty, deleteProperty, resetProperties, refreshProperties } = usePropertyStore();
  const [query, setQuery] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<PropertyFormState>(createEmptyForm);
  const [priceCurrency, setPriceCurrency] = useState<PriceCurrency>("GBP");
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("Sqft");
  const [isProcessingPrimaryImage, setIsProcessingPrimaryImage] = useState(false);
  const [isProcessingGalleryImages, setIsProcessingGalleryImages] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showSellHouseSection, setShowSellHouseSectionState] = useState(true);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const primaryImageInputRef = useRef<HTMLInputElement | null>(null);
  const galleryImagesInputRef = useRef<HTMLInputElement | null>(null);
  const searchPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!supabaseConfigured || !supabase) {
      setAuthLoading(false);
      return;
    }

    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setShowSellHouseSectionState(getShowSellHouseSection());
  }, []);

  const isAuthenticated = Boolean(session);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!searchPanelRef.current?.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    const editSlug = searchParams.get("edit");
    if (!editSlug || loading) return;

    const property = properties.find((p) => p.slug === editSlug);
    if (property) {
      setEditingSlug(property.slug);
      setForm(propertyToForm(property));
      setSearchParams({}, { replace: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!loading && properties.length > 0) {
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, properties, loading, setSearchParams]);

  const filteredProperties = properties.filter((property) => {
    const searchValue = query.toLowerCase();
    return (
      property.title.toLowerCase().includes(searchValue) ||
      property.location.toLowerCase().includes(searchValue) ||
      property.category.toLowerCase().includes(searchValue)
    );
  });
  const trimmedQuery = query.trim().toLowerCase();
  const searchSuggestions = trimmedQuery
    ? properties
        .map((property) => {
          const searchableValues = [
            property.title.toLowerCase(),
            property.location.toLowerCase(),
            property.address.toLowerCase(),
            property.category.toLowerCase(),
            property.status.toLowerCase(),
            property.type.toLowerCase(),
          ];

          const score = property.title.toLowerCase().startsWith(trimmedQuery)
            ? 0
            : property.title.toLowerCase().includes(trimmedQuery)
              ? 1
              : property.location.toLowerCase().includes(trimmedQuery)
                ? 2
                : property.category.toLowerCase().includes(trimmedQuery)
                  ? 3
                  : 4;

          return { property, score, matches: searchableValues.some((value) => value.includes(trimmedQuery)) };
        })
        .filter((item) => item.matches)
        .sort((left, right) => {
          if (left.score !== right.score) return left.score - right.score;
          if (left.property.featured !== right.property.featured) return Number(right.property.featured) - Number(left.property.featured);
          return left.property.title.localeCompare(right.property.title);
        })
        .slice(0, 5)
        .map((item) => item.property)
    : [];

  const featuredCount = properties.filter((property) => property.featured).length;
  const videoCount = properties.filter((property) => property.videoEmbedUrl).length;
  const residentialCount = properties.filter((property) => property.category === "Residential").length;
  const galleryPreviewImages = Array.from(new Set([...parseMultiline(form.galleryText), ...form.uploadedGalleryImages]));
  const primaryPreviewImage = form.uploadedPrimaryImage || form.image.trim();
  const selectedAmenities = useMemo(() => new Set(parseMultiline(form.amenitiesText)), [form.amenitiesText]);

  const resetForm = () => {
    setEditingSlug(null);
    setForm(createEmptyForm());
    setPriceCurrency("GBP");
    setAreaUnit("Sqft");
  };

  const handleEdit = (property: Property) => {
    setEditingSlug(property.slug);
    const nextForm = propertyToForm(property);
    const split = splitPriceValue(nextForm.price);
    setPriceCurrency(split.currency);
    const parsedArea = parseArea(nextForm.area);
    setAreaUnit(parsedArea.unit);
    setForm({
      ...nextForm,
      price: buildPrice(split.currency, split.numberPart),
      area: buildArea(parsedArea.numberPart, parsedArea.unit),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (property: Property) => {
    const confirmed = window.confirm(`Delete "${property.title}" from the property listings?`);
    if (!confirmed) return;

    try {
      await deleteProperty(property.slug);
      if (editingSlug === property.slug) {
        resetForm();
      }
      toast.success("Property removed from listings.");
    } catch (error) {
      if (import.meta.env.DEV) console.error(error);
      toast.error("Could not delete that property.");
    }
  };

  const handleResetListings = async () => {
    const confirmed = window.confirm("Reset all property listings back to the default Sav Zaman data?");
    if (!confirmed) return;

    try {
      await resetProperties();
      resetForm();
      toast.success("Property listings reset to defaults.");
    } catch (error) {
      if (import.meta.env.DEV) console.error(error);
      toast.error("Could not reset the property listings.");
    }
  };

  const handleSuggestionSelect = (property: Property) => {
    setQuery(property.title);
    setShowSuggestions(false);
  };

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabaseConfigured || !supabase) {
      toast.error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email.trim(),
        password: credentials.password,
      });
      if (error) throw error;
      toast.success("Admin access granted.");
    } catch (error) {
      if (import.meta.env.DEV) console.error(error);
      toast.error("Invalid admin email or password.");
    }
  };

  const handleSignOut = async () => {
    if (!supabaseConfigured || !supabase) {
      toast.error("Supabase is not configured.");
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      if (import.meta.env.DEV) console.error(error);
      toast.error("Could not sign out.");
      return;
    }
    toast.success("Signed out from admin.");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = form.title.trim();
    const location = form.location.trim();
    const price = form.price.trim();
    const area = form.area.trim();
    const image = (form.uploadedPrimaryImage || form.image).trim();
    const overview = form.overview.trim();
    const amenities = parseMultiline(form.amenitiesText);

    if (!title || !location || !price || !area || !image || !overview) {
      toast.error("Fill in title, location, price, area, image, and overview.");
      return;
    }

    if (!amenities.length) {
      toast.error("Add at least one amenity or property highlight.");
      return;
    }

    setIsSaving(true);

    try {
      const primaryImageUrl = form.uploadedPrimaryImage ? await uploadDataUrlImage(form.uploadedPrimaryImage) : form.image.trim();
      const uploadedGalleryUrls = await Promise.all(form.uploadedGalleryImages.map((item) => uploadDataUrlImage(item)));
      const galleryUrls = Array.from(new Set([...parseMultiline(form.galleryText), ...uploadedGalleryUrls]));

      const nextProperty: Property = {
        slug: createPropertySlug(form.slug || title),
        title,
        location,
        address: form.address.trim() || `${title}, ${location}, United Kingdom`,
        price,
        type: form.type,
        area,
        beds: form.beds.trim() || undefined,
        baths: form.baths.trim() || undefined,
        category: form.category,
        overview,
        amenities,
        status: form.status,
        featured: form.featured,
        heroFeatured: form.heroFeatured,
        image: primaryImageUrl,
        gallery: galleryUrls,
        videoEmbedUrl: normalizeVideoEmbedUrl(form.videoUrl),
      };

      await upsertProperty(nextProperty, editingSlug ?? undefined);
      toast.success(editingSlug ? "Property updated." : "Property published.");
      resetForm();
    } catch (error) {
      if (import.meta.env.DEV) console.error(error);
      toast.error("Could not save this property.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrimaryImageSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingPrimaryImage(true);

    try {
      const optimizedImage = await optimizeImageFile(file);
      setForm((current) => ({ ...current, uploadedPrimaryImage: optimizedImage }));
      toast.success("Primary image added.");
    } catch {
      toast.error("Could not process that image.");
    } finally {
      setIsProcessingPrimaryImage(false);
      event.target.value = "";
    }
  };

  const handleGalleryImagesSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setIsProcessingGalleryImages(true);

    try {
      const nextImages = await Promise.all(files.map((file) => optimizeImageFile(file)));

      setForm((current) => ({
        ...current,
        uploadedPrimaryImage: current.uploadedPrimaryImage || (!current.image ? nextImages[0] || "" : ""),
        uploadedGalleryImages: Array.from(new Set([...current.uploadedGalleryImages, ...nextImages])),
      }));

      toast.success(`${files.length} gallery image${files.length > 1 ? "s" : ""} added.`);
    } catch {
      toast.error("Could not process the selected gallery images.");
    } finally {
      setIsProcessingGalleryImages(false);
      event.target.value = "";
    }
  };

  if (authLoading) {
    return (
      <main>
        <section className="container-custom py-20">
          <p className="text-muted-foreground text-lg">Checking admin access...</p>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex flex-1 flex-col bg-primary">
        <section className="relative flex flex-1 items-center overflow-hidden section-padding-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--accent)/0.28),transparent_35%)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
          <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-accent/15 blur-3xl" />
          <div className="container-custom relative z-10">
            <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
	              <AnimatedSection>
	                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/80">
	                  <LockKeyhole className="h-4 w-4 text-accent" />
	                  Admin Access
	                </span>
	                <h1 className="mt-5 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
	                  Sign in to manage live property listings
	                </h1>
	                <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/75 md:text-lg">
	                  This portal uses real Supabase authentication and publishes changes directly to the live website.
	                </p>
	              </AnimatedSection>

	              <AnimatedSection direction="right">
	                <motion.div
	                  initial={{ opacity: 0, y: 22, scale: 0.98 }}
	                  animate={{ opacity: 1, y: 0, scale: 1 }}
	                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
	                  className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-card/95 p-7 shadow-[0_35px_75px_-40px_rgba(8,47,119,0.75)] backdrop-blur"
	                >
	                  <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/25 blur-3xl" />
	                  <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-primary/40 blur-3xl" />
	                  <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent" />
	                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Secure Login</p>
	                  <h2 className="mt-3 font-heading text-2xl font-bold text-foreground">Admin Sign In</h2>
	                  <p className="mt-2 text-sm text-muted-foreground">Use your Supabase admin account credentials.</p>
	                  <form onSubmit={handleSignIn} className="mt-6 space-y-4">
	                    <div className="space-y-2 rounded-3xl border border-border/70 bg-[hsl(var(--secondary))] p-4 transition-colors hover:border-accent/30">
	                      <label className="text-sm font-medium text-foreground">Email</label>
	                      <Input
	                        type="email"
	                        value={credentials.email}
	                        onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
	                        placeholder="admin@savzamanuk.com"
	                        className="h-11 rounded-xl border-border/70 bg-white/90"
	                        required
	                      />
	                    </div>
	                    <div className="space-y-2 rounded-3xl border border-border/70 bg-[hsl(var(--secondary))] p-4 transition-colors hover:border-accent/30">
	                      <label className="text-sm font-medium text-foreground">Password</label>
	                      <Input
	                        type="password"
	                        value={credentials.password}
	                        onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
	                        placeholder="Enter your password"
	                        className="h-11 rounded-xl border-border/70 bg-white/90"
	                        required
	                      />
	                    </div>
	                    <motion.button
	                      whileHover={{ y: -1 }}
	                      whileTap={{ scale: 0.99 }}
	                      type="submit"
	                      disabled={!supabaseConfigured}
	                      className="btn-accent inline-flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
	                    >
	                      Sign In
	                      <ArrowRight className="h-4 w-4" />
	                    </motion.button>
	                  </form>
	                  {!supabaseConfigured ? (
	                    <div className="mt-4 rounded-2xl border border-amber-300/30 bg-amber-200/20 p-4 text-sm text-amber-900">
	                      Supabase environment keys are missing. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`.
	                    </div>
	                  ) : null}
	                </motion.div>
	              </AnimatedSection>
	            </div>

            <AnimatedSection delay={0.12} className="mx-auto mt-10 max-w-5xl">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.06] px-5 py-4 shadow-[0_26px_60px_-34px_hsl(var(--accent)/0.6)] backdrop-blur-xl">
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse" />
                <div className="absolute -left-10 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl" />
                <div className="absolute right-6 top-1/2 h-14 w-14 -translate-y-1/2 rounded-full bg-white/10 blur-2xl" />
                <div className="relative flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/12 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                    Realtime Sync
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/80">
                    <PlayCircle className="h-3.5 w-3.5 text-accent" />
                    Live Listing Publish
                  </span>
                  <div className="ml-auto hidden items-center gap-3 md:flex">
                    <span className="h-px w-16 bg-gradient-to-r from-transparent via-accent/90 to-transparent animate-pulse" />
	                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-foreground/55">Sav Zaman Admin Portal</p>
	                  </div>
	                </div>
	              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="relative overflow-hidden bg-primary section-padding-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--accent)/0.28),transparent_35%)]" />
        <div className="absolute -bottom-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
        <div className="container-custom relative z-10">
          <AnimatedSection className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/80">
              <LayoutDashboard className="h-4 w-4 text-accent" />
              Admin Access
            </span>
            <h1 className="mt-5 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
              Manage live property listings for Sav Zaman
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/75 md:text-lg">
              Add, edit, and publish listings from one panel. Changes here sync to the public website through Supabase.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="btn-accent inline-flex min-w-[160px] items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm"
              >
                <HousePlus className="h-4 w-4" />
                New Listing
              </button>
              <button
                type="button"
                onClick={handleResetListings}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-white/10"
              >
                <RefreshCcw className="h-4 w-4" />
                Reset Defaults
              </button>
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-5 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                View Public Listings
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/admin/inquiries"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-white/10"
              >
                <Mail className="h-4 w-4 text-accent" />
                Client Queries
              </Link>
              <Link
                to="/admin/records"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-white/10"
              >
                <TableProperties className="h-4 w-4 text-accent" />
                Property Records
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding bg-warm">
        <div className="container-custom">
          <AnimatedSection>
            <div className="glass-card mb-8 p-5 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">UI Settings</p>
                  <h2 className="mt-2 font-heading text-2xl font-bold text-foreground">Homepage sections</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Toggle visibility for isolated homepage sections only.
                  </p>
                </div>
                <label className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-white px-4 py-4 md:min-w-[360px]">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">Show Sell House Section</p>
                    <p className="mt-1 text-xs text-muted-foreground">Controls the homepage “Want to sell your house?” section.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={showSellHouseSection}
                    onChange={(e) => {
                      const next = e.target.checked;
                      setShowSellHouseSectionState(next);
                      setShowSellHouseSection(next);
                    }}
                    className="h-5 w-5 rounded border-accent/40 accent-[hsl(var(--accent))]"
                  />
                </label>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Listings", value: properties.length.toString(), icon: LayoutDashboard },
              { label: "Featured", value: featuredCount.toString(), icon: Star },
              { label: "With Video", value: videoCount.toString(), icon: PlayCircle },
              { label: "Residential", value: residentialCount.toString(), icon: Sparkles },
            ].map((item) => (
              <AnimatedSection key={item.label}>
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-3 font-heading text-3xl font-bold text-foreground">{item.value}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
                      <item.icon className="h-5 w-5 text-accent" />
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1.02fr,1.28fr]">
            <AnimatedSection>
              <div className="glass-card overflow-hidden">
                <div className="border-b border-border/70 px-6 py-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="font-heading text-2xl font-bold text-foreground">Listing Library</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Select a property to edit it or remove it from the site.
                      </p>
                    </div>
                    <div ref={searchPanelRef} className="relative w-full md:max-w-xs">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Search listings"
                        className="h-11 rounded-xl border-border/70 bg-background pl-10"
                      />
                      {showSuggestions && trimmedQuery ? (
                        <div className="absolute inset-x-0 top-[calc(100%+0.6rem)] z-20 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_26px_50px_-28px_hsl(var(--charcoal)/0.45)]">
                          {searchSuggestions.length ? (
                            <div className="p-2">
                              {searchSuggestions.map((property) => (
                                <button
                                  key={property.slug}
                                  type="button"
                                  onClick={() => handleSuggestionSelect(property)}
                                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-muted/70"
                                >
                                  <img
                                    src={property.image}
                                    alt={property.title}
                                    className="h-12 w-12 rounded-xl object-cover"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-foreground">{property.title}</p>
                                    <p className="truncate text-xs text-muted-foreground">{property.location}</p>
                                  </div>
                                  <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
                                    {property.category}
                                  </span>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="px-4 py-5 text-sm text-muted-foreground">
                              No matching listings yet. Try title, location, or category.
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="max-h-[900px] space-y-4 overflow-y-auto p-6">
                  {filteredProperties.map((property) => (
                    <div
                      key={property.slug}
                      className={`group overflow-hidden rounded-3xl border bg-card shadow-sm transition-all duration-300 ${
                        editingSlug === property.slug
                          ? "border-accent/40 shadow-[0_24px_50px_-28px_hsl(var(--accent)/0.55)]"
                          : "border-border/70 hover:border-accent/20"
                      }`}
                    >
                      <div className="p-4">
                        <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-gradient-to-br from-card via-card to-muted/20 shadow-[0_18px_40px_-28px_hsl(var(--charcoal)/0.35)]">
                          <div className="relative aspect-[16/8] overflow-hidden bg-gradient-to-br from-primary/15 via-muted to-accent/10">
                            <img
                              src={property.image}
                              alt={property.title}
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/15 to-transparent" />
                            <div className="absolute left-4 right-4 top-4 flex flex-wrap items-start justify-between gap-2">
                              <span className="rounded-full border border-accent/40 bg-accent px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground shadow-lg shadow-accent/20">
                                {property.category}
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {property.featured ? (
                                  <span className="rounded-full border border-white/10 bg-white/[0.12] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur">
                                    Featured
                                  </span>
                                ) : null}
                                {property.videoEmbedUrl ? (
                                  <span className="rounded-full border border-white/10 bg-primary/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur">
                                    Video
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <div className="absolute inset-x-4 bottom-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
                              <div className="min-w-0 rounded-2xl border border-white/10 bg-[linear-gradient(135deg,hsl(var(--charcoal)/0.9),hsl(var(--charcoal-light)/0.7),hsl(var(--accent)/0.15))] px-4 py-3 backdrop-blur-md shadow-[0_24px_50px_-28px_hsl(var(--accent)/0.7)] sm:max-w-[65%]">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/65">
                                  Listing Snapshot
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <span className="max-w-full truncate rounded-full border border-accent/20 bg-accent/15 px-3 py-1 text-[11px] font-medium text-white">
                                    {property.status}
                                  </span>
                                  <span className="max-w-full truncate rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90">
                                    {property.area}
                                  </span>
                                </div>
                              </div>
                              <div className="w-full rounded-2xl border border-white/10 bg-primary/[0.45] px-4 py-3 text-left backdrop-blur-md sm:w-auto sm:min-w-[190px] sm:text-right">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                                  Asking Price
                                </p>
                                <p className="mt-1 break-words font-heading text-xl font-bold leading-tight text-white sm:text-2xl">
                                  {property.price}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4 p-5">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                    {property.type}
                                  </span>
                                  {property.featured ? (
                                    <span className="rounded-full bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent">
                                      Featured listing
                                    </span>
                                  ) : null}
                                </div>
                                <h3 className="mt-3 font-heading text-2xl font-bold leading-tight text-foreground">
                                  {property.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                  {property.address}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-2 lg:justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleEdit(property)}
                                  className="inline-flex items-center gap-2 rounded-xl border border-accent/25 bg-accent/5 px-4 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
                                >
                                  <PencilLine className="h-4 w-4" />
                                  Edit
                                </button>
                                <Link
                                  to={propertyDetailPath(property)}
                                  className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent/25 hover:text-accent"
                                >
                                  <Eye className="h-4 w-4" />
                                  View
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(property)}
                                  className="inline-flex items-center gap-2 rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground">
                                {property.category}
                              </span>
                              <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground">
                                {property.status}
                              </span>
                              <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground">
                                {property.area}
                              </span>
                              <span className="rounded-full border border-border/70 bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                                {property.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {loading && filteredProperties.length === 0 ? (
                    <div className="rounded-3xl border border-border/70 bg-background/80 px-6 py-12 text-center">
                      <p className="font-heading text-xl font-semibold text-foreground">Loading live listings...</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Pulling the latest property data from Supabase.
                      </p>
                    </div>
                  ) : null}

                  {!loading && filteredProperties.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-border/80 bg-background/80 px-6 py-12 text-center">
                      <p className="font-heading text-xl font-semibold text-foreground">No listings matched that search.</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Try another search or create a new listing from the form.
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="overflow-hidden rounded-[34px] border border-border/70 bg-card shadow-[0_32px_80px_-42px_rgba(15,23,42,0.3)]">
                <div className="relative overflow-hidden border-b border-border/70 bg-[linear-gradient(135deg,rgba(37,99,235,0.12),rgba(37,99,235,0.04)_42%,rgba(255,255,255,0.2))] px-6 py-6">
                  <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-accent/15 blur-3xl" />
                  <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                        {editingSlug ? "Edit Listing" : "Create Listing"}
                      </p>
                      <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-0.03em] text-foreground">
                        {editingSlug ? "Update property details" : "Design a new property presentation"}
                      </h2>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                        Shape the listing story, media, and publishing controls from one cleaner admin workspace.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[
                        form.category || "Category",
                        form.status || "Status",
                        form.featured ? "Featured" : "Standard",
                        form.heroFeatured ? "Hero" : "Not in hero",
                      ].map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-accent/20 bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground"
                        >
                          {item}
                        </span>
                      ))}
                      {editingSlug ? (
                        <button
                          type="button"
                          onClick={resetForm}
                          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/80 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-accent/25 hover:text-accent"
                        >
                          <RefreshCcw className="h-4 w-4" />
                          Cancel editing
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.06),transparent_34%)] p-6"
                >
                  <div className="rounded-[28px] border border-border/70 bg-white p-5 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.3)] md:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Property Form</p>
                    <h2 className="mt-2 font-heading text-2xl font-bold text-foreground">Add / edit a listing</h2>
                  </div>
                  <input
                    ref={primaryImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePrimaryImageSelection}
                    className="hidden"
                  />
                  <input
                    ref={galleryImagesInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImagesSelection}
                    className="hidden"
                  />

			                  <div className="grid gap-5 rounded-[28px] border border-border/70 bg-white p-5 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.3)] md:grid-cols-2 md:p-6">
		                    <div className="space-y-2">
		                      <label className="text-sm font-medium text-foreground">Property Title</label>
		                      <Input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Riverside Two Bedroom Apartment" className="h-11 rounded-xl border-border/70" />
		                    </div>
		                    <div className="space-y-2">
		                      <label className="text-sm font-medium text-foreground">Location</label>
		                      <Input value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} placeholder="Canary Wharf, London" className="h-11 rounded-xl border-border/70" />
		                    </div>
	                    <div className="space-y-2">
	                      <label className="text-sm font-medium text-foreground">Price</label>
	                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr]">
	                        <Select
	                          value={priceCurrency}
	                          onValueChange={(value) => {
	                            const next = (value || "GBP") as PriceCurrency;
	                            setPriceCurrency(next);
	                            setForm((current) => {
	                              const { numberPart } = splitPriceValue(current.price);
	                              return { ...current, price: buildPrice(next, numberPart) };
	                            });
	                          }}
	                        >
	                          <SelectTrigger className="h-11 rounded-xl border-border/70">
	                            <SelectValue />
	                          </SelectTrigger>
	                          <SelectContent>
	                            {PRICE_CURRENCIES.map((c) => (
	                              <SelectItem key={c.code} value={c.code}>
	                                {c.label}
	                              </SelectItem>
	                            ))}
	                          </SelectContent>
	                        </Select>
	                        <Input
	                          value={formatNumberWithCommas(splitPriceValue(form.price).numberPart)}
	                          onChange={(event) => {
	                            const nextNumberPart = event.target.value;
	                            setForm((current) => ({ ...current, price: buildPrice(priceCurrency, nextNumberPart) }));
	                          }}
	                          placeholder="845,000"
	                          className="h-11 rounded-xl border-border/70"
	                          inputMode="numeric"
	                        />
	                      </div>
	                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-foreground">Full Address</label>
                      <Input value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} placeholder="Full address shown on the detail page" className="h-11 rounded-xl border-border/70" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Category</label>
                      <Select value={form.category} onValueChange={(value) => setForm((current) => ({ ...current, category: value }))}>
                        <SelectTrigger className="h-11 rounded-xl border-border/70">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Listing Type</label>
                      <Select value={form.type} onValueChange={(value) => setForm((current) => ({ ...current, type: value }))}>
                        <SelectTrigger className="h-11 rounded-xl border-border/70">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyListingTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Status</label>
                      <Select value={form.status} onValueChange={(value) => setForm((current) => ({ ...current, status: value }))}>
                        <SelectTrigger className="h-11 rounded-xl border-border/70">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Area</label>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr]">
                        <Select
                          value={areaUnit}
                          onValueChange={(value) => {
                            const next = (value || "Sqft") as AreaUnit;
                            setAreaUnit(next);
                            setForm((current) => {
                              const parsed = parseArea(current.area);
                              return { ...current, area: buildArea(parsed.numberPart, next) };
                            });
                          }}
                        >
                          <SelectTrigger className="h-11 rounded-xl border-border/70">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {AREA_UNITS.map((u) => (
                              <SelectItem key={u.value} value={u.value}>
                                {u.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          value={parseArea(form.area).numberPart}
                          onChange={(event) => {
                            const nextNumberPart = event.target.value;
                            setForm((current) => ({ ...current, area: buildArea(nextNumberPart, areaUnit) }));
                          }}
                          placeholder="1650"
                          className="h-11 rounded-xl border-border/70"
                          inputMode="decimal"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Beds</label>
                      <Select value={form.beds} onValueChange={(value) => setForm((current) => ({ ...current, beds: value }))}>
                        <SelectTrigger className="h-11 rounded-xl border-border/70">
                          <SelectValue placeholder="Select BHK" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {BED_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Baths</label>
                      <Select value={form.baths} onValueChange={(value) => setForm((current) => ({ ...current, baths: value }))}>
                        <SelectTrigger className="h-11 rounded-xl border-border/70">
                          <SelectValue placeholder="Select baths" />
                        </SelectTrigger>
                        <SelectContent>
                          {BATH_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

	                  <div className="grid gap-6 rounded-[28px] border border-border/70 bg-white p-5 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.3)] md:p-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Overview</label>
                      <Textarea value={form.overview} onChange={(event) => setForm((current) => ({ ...current, overview: event.target.value }))} placeholder="Describe the property in a few high-signal lines." className="min-h-[120px] rounded-2xl border-border/70" />
                    </div>

	                    <div className="grid gap-5 rounded-[24px] border border-border/70 bg-[hsl(var(--secondary))] p-4 md:grid-cols-2">
		                    <div className="space-y-2 rounded-[24px] border border-border/70 bg-[hsl(var(--secondary))] p-4">
                        <label className="text-sm font-medium text-foreground">Primary Image URL</label>
                        <Input
                          value={form.image}
                          onChange={(event) => setForm((current) => ({ ...current, image: event.target.value, uploadedPrimaryImage: "" }))}
                          placeholder="https://..."
                          className="h-11 rounded-xl border-border/70"
                        />
                        <div className="flex flex-wrap gap-3 pt-1">
                          <button type="button" onClick={() => primaryImageInputRef.current?.click()} disabled={isProcessingPrimaryImage} className="inline-flex items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60">
                            <ImagePlus className="h-4 w-4" />
                            {isProcessingPrimaryImage ? "Preparing image..." : "Choose From Device"}
                          </button>
                          {form.uploadedPrimaryImage ? (
                            <button type="button" onClick={() => setForm((current) => ({ ...current, uploadedPrimaryImage: "" }))} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-accent/25 hover:text-accent">
                              Remove Upload
                            </button>
                          ) : null}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          This is the main cover image shown on property cards and at the top of the property detail page. Use a public image URL, or
                          choose one from your device to upload.
                        </p>
                        {form.uploadedPrimaryImage ? <p className="text-xs font-medium text-accent">Uploaded image selected from device.</p> : null}
                        {primaryPreviewImage ? (
                          <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted">
                            <img src={primaryPreviewImage} alt="Primary preview" className="h-44 w-full object-cover" />
                          </div>
                        ) : null}
                      </div>
	                      <div className="space-y-2">
	                        <label className="text-sm font-medium text-foreground">YouTube Video URL</label>
	                        <Input value={form.videoUrl} onChange={(event) => setForm((current) => ({ ...current, videoUrl: event.target.value }))} placeholder="https://www.youtube.com/watch?v=..." className="h-11 rounded-xl border-border/70" />
	                        <p className="text-xs text-muted-foreground">Paste a standard YouTube link or an embed URL.</p>
	                      </div>
	                    </div>

	                    <div className="space-y-2">
	                      <label className="text-sm font-medium text-foreground">Gallery URLs</label>
	                      <Textarea
	                        value={form.galleryText}
	                        onChange={(event) => setForm((current) => ({ ...current, galleryText: event.target.value }))}
	                        placeholder={"One image URL per line\nhttps://...\nhttps://..."}
	                        className="min-h-[140px] rounded-2xl border-border/70"
	                      />
	                      <div className="flex flex-wrap gap-3 pt-1">
	                        <button
	                          type="button"
	                          onClick={() => galleryImagesInputRef.current?.click()}
	                          disabled={isProcessingGalleryImages}
	                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60"
	                        >
	                          <Images className="h-4 w-4" />
	                          {isProcessingGalleryImages ? "Preparing gallery..." : "Add Gallery Images"}
	                        </button>
	                        {form.uploadedGalleryImages.length ? (
	                          <button
	                            type="button"
	                            onClick={() => setForm((current) => ({ ...current, uploadedGalleryImages: [] }))}
	                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-accent/25 hover:text-accent"
	                          >
	                            Clear Uploaded Gallery
	                          </button>
	                        ) : null}
	                      </div>
                      <p className="text-xs text-muted-foreground">
                        These images form the full gallery on the property detail page (buyers can swipe through them). Add one public image URL per line,
                        or upload multiple images from your device.
                      </p>
	                    </div>

	                    {galleryPreviewImages.length ? (
	                      <div className="space-y-3">
	                        <div className="flex flex-wrap items-center justify-between gap-3">
	                          <div>
	                            <p className="text-sm font-medium text-foreground">Gallery Preview</p>
	                            <p className="text-xs text-muted-foreground">
	                              {galleryPreviewImages.length} image{galleryPreviewImages.length > 1 ? "s" : ""} ready for this listing
	                            </p>
	                          </div>
	                          <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
	                            Media Ready
	                          </span>
	                        </div>
	                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
	                          {galleryPreviewImages.map((image, index) => (
	                            <div
	                              key={`${image}-${index}`}
	                              className="overflow-hidden rounded-2xl border border-border/70 bg-background shadow-sm"
	                            >
	                              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
	                                <img
	                                  src={image}
	                                  alt={`Gallery preview ${index + 1}`}
	                                  className="h-full w-full object-cover"
	                                />
	                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/85 to-transparent px-3 py-2">
	                                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
	                                    Gallery {index + 1}
	                                  </p>
	                                </div>
	                              </div>
	                              <div className="flex items-center justify-between gap-3 px-3 py-3">
	                                <p className="truncate text-xs text-muted-foreground">
	                                  {image.startsWith("data:image/") ? "Uploaded from device" : "External image URL"}
	                                </p>
	                                <button
	                                  type="button"
	                                  onClick={() =>
	                                    setForm((current) => ({
	                                      ...current,
	                                      galleryText: parseMultiline(current.galleryText)
	                                        .filter((item) => item !== image)
	                                        .join("\n"),
	                                      uploadedGalleryImages: current.uploadedGalleryImages.filter((item) => item !== image),
	                                    }))
	                                  }
	                                  className="text-xs font-medium text-accent transition-colors hover:text-accent/80"
	                                >
	                                  Remove
	                                </button>
	                              </div>
	                            </div>
	                          ))}
	                        </div>
	                      </div>
	                    ) : null}

		                    <div className="grid gap-5 rounded-[24px] border border-border/70 bg-[hsl(var(--secondary))] p-4 md:grid-cols-[1.2fr,0.8fr]">
	                      <div className="space-y-2">
	                        <label className="text-sm font-medium text-foreground">Amenities / Highlights</label>
	                        <Textarea
	                          value={form.amenitiesText}
	                          onChange={(event) => setForm((current) => ({ ...current, amenitiesText: event.target.value }))}
	                          placeholder={"One highlight per line\nCorner plot with excellent approach road access\nPremium society with modern amenities"}
	                          className="min-h-[170px] rounded-2xl border-border/70"
	                        />
                          <div className="mt-4 rounded-2xl border border-border/70 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Quick select</p>
                            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                              Click to add/remove common amenities. Custom items can still be typed manually above.
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {AMENITY_OPTIONS.map((amenity) => {
                                const active = selectedAmenities.has(amenity);
                                return (
                                  <button
                                    key={amenity}
                                    type="button"
                                    onClick={() => {
                                      setForm((current) => {
                                        const list = parseMultiline(current.amenitiesText);
                                        const set = new Set(list);
                                        if (set.has(amenity)) set.delete(amenity);
                                        else set.add(amenity);
                                        return { ...current, amenitiesText: Array.from(set).join("\n") };
                                      });
                                    }}
                                    className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                                      active
                                        ? "border-accent/30 bg-accent/10 text-accent"
                                        : "border-border/70 bg-white text-foreground hover:border-accent/25 hover:bg-[hsl(var(--secondary))]"
                                    }`}
                                  >
                                    {amenity}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
	                        <p className="text-xs text-muted-foreground">
	                          These lines appear inside the red-accent amenities card on the property detail page.
	                        </p>
	                      </div>

		                      <div className="space-y-4 rounded-[24px] border border-border/70 bg-white p-4">
	                        <label className="block text-sm font-medium text-foreground">Publishing Controls</label>
                        <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-accent/15 bg-accent/5 p-4 transition-colors hover:border-accent/30">
                          <input
                            type="checkbox"
                            checked={form.featured}
                            onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
                            className="mt-1 h-4 w-4 rounded border-accent/40 accent-[hsl(var(--accent))]"
                          />
                          <div>
                            <p className="text-sm font-semibold text-foreground">Mark as featured listing</p>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                              Featured properties surface on the home page and stay prioritized inside the listing feed.
                            </p>
                          </div>
                        </label>
	                      </div>
	                    </div>

		                    <div className="flex flex-col gap-4 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
	                      <p className="text-xs leading-relaxed text-muted-foreground">
	                        Required: title, location, price, area, image, overview, and at least one amenity.
	                      </p>
	                      <div className="flex flex-wrap gap-3">
	                        <button
	                          type="button"
	                          onClick={resetForm}
	                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-accent/25 hover:text-accent"
	                        >
	                          <RefreshCcw className="h-4 w-4" />
	                          Clear Form
	                        </button>
	                        <button
	                          type="submit"
	                          disabled={isSaving || isProcessingPrimaryImage || isProcessingGalleryImages}
	                          className="btn-accent inline-flex min-w-[200px] shrink-0 items-center justify-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-semibold tracking-tight disabled:cursor-not-allowed disabled:opacity-60"
	                        >
	                          <span className="whitespace-nowrap">
	                            {isSaving
	                              ? editingSlug
	                                ? "Updating..."
	                                : "Publishing..."
	                              : editingSlug
	                                ? "Update Listing"
	                                : "Publish Listing"}
	                          </span>
	                          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
	                        </button>
	                      </div>
	                    </div>
	                  </div>
	                </form>
	              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Admin;
