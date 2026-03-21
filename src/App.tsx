import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "./components/Navbar";
import { PropertyBrowseStickyChrome } from "./components/property-browse/PropertyBrowseStickyChrome";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppBubble from "./components/WhatsAppBubble";
import { EnquiryModal } from "./components/EnquiryModal";
import { EnquiryModalProvider } from "./context/EnquiryModalContext";
import { PropertyBrowseProvider } from "./context/PropertyBrowseContext";
import { PropertyStoreProvider } from "./context/PropertyStoreContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";
import AdminInquiries from "./pages/AdminInquiries";
import NotFound from "./pages/NotFound";
import LegalDocument from "./pages/LegalDocument";
import SearchListingDetailPage from "./pages/SearchListingDetailPage";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <PropertyStoreProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <EnquiryModalProvider>
        <PropertyBrowseProvider>
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <ScrollToTop />
          <PropertyBrowseStickyChrome navbar={<Navbar />}>
            <div className="flex flex-1 flex-col pt-[88px] md:pt-24">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:slug" element={<PropertyDetail />} />
              <Route path="/search" element={<Navigate to="/properties" replace />} />
              <Route path="/listings/:slug" element={<SearchListingDetailPage />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<LegalDocument slug="privacy-policy" />} />
              <Route path="/terms-of-use" element={<LegalDocument slug="terms-of-use" />} />
              <Route path="/cookies" element={<LegalDocument slug="cookies" />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/inquiries" element={<AdminInquiries />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </div>
          </PropertyBrowseStickyChrome>
          <WhatsAppBubble />
          <Footer />
          <EnquiryModal />
        </div>
        </PropertyBrowseProvider>
        </EnquiryModalProvider>
      </BrowserRouter>
    </PropertyStoreProvider>
  </TooltipProvider>
);

export default App;
