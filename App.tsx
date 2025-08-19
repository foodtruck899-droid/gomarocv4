import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import UserProfile from "./pages/UserProfile";
import ProtectedAdminDashboard from "./pages/ProtectedAdminDashboard";
import NotFound from "./pages/NotFound";
import RouteSearch from "./pages/RouteSearch";
import SearchResultsPage from "./pages/SearchResultsPage";
import BookingPage from "./pages/BookingPage";
import BookingConfirmation from "./pages/BookingConfirmation";
import Schedules from "./pages/Schedules";
import ResetPassword from "./pages/ResetPassword";
import Destinations from "./pages/Destinations";
import Services from "./pages/Services";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import GiftCards from "./pages/GiftCards";
import GiftCardSuccess from "./pages/GiftCardSuccess";
import PopularRoutes from "./pages/PopularRoutes";
import BusStations from "./pages/BusStations";
import LegalMentions from "./pages/LegalMentions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Cookies from "./pages/Cookies";
import RecurringTripsManager from "./pages/RecurringTripsManager";
import { SiteAnalyzer } from "./components/SiteAnalyzer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin" element={<ProtectedAdminDashboard />} />
          <Route path="/admin/recurring-trips" element={<RecurringTripsManager />} />
          <Route path="/routes" element={<RouteSearch />} />
          <Route path="/search-results" element={<SearchResultsPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/schedules" element={<Schedules />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/services" element={<Services />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
          <Route path="/gift-cards" element={<GiftCards />} />
          <Route path="/gift-card-success" element={<GiftCardSuccess />} />
          <Route path="/popular-routes" element={<PopularRoutes />} />
          <Route path="/bus-stations" element={<BusStations />} />
          <Route path="/legal-mentions" element={<LegalMentions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<Cookies />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <SiteAnalyzer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
