import { Button } from "@/components/ui/button";
import { ChevronDown, User, LogOut, Settings, MapPin, Phone, HelpCircle, Bus, Menu, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    user,
    isAdmin,
    signOut
  } = useAuth();
  
  const { getContent } = useSiteContent();
  const navigate = useNavigate();

  const handleTrackingClick = () => {
    if (window.location.pathname !== '/') {
      navigate('/');
      return;
    }
    const trackingSection = document.getElementById('booking-tracking');
    if (trackingSection) {
      trackingSection.click();
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-primary to-accent text-white shadow-lg">
      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden">
        {/* Header mobile avec 3 zones */}
        <div className="grid grid-cols-3 items-center px-4 py-3 border-b border-white/20">
          {/* Logo France + FR à gauche */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-4 bg-gradient-to-r from-blue-600 via-white to-red-600 rounded-sm flex items-center justify-center">
              <span className="text-xs font-bold text-blue-800">🇫🇷</span>
            </div>
            <span className="text-sm font-medium">FR</span>
          </div>
          
          {/* GO MAROC au centre */}
          <div className="text-center">
            <Link to="/" className="text-xl font-bold tracking-wide hover:opacity-80 transition-opacity">
              GO MAROC
            </Link>
          </div>
          
          {/* Connexion plus à gauche */}
          <div className="flex justify-end ml-8">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center text-white hover:bg-white/10 px-2 py-1">
                    <span className="text-sm">Mon compte</span>
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 py-4 bg-white dark:bg-gray-800 border shadow-lg z-50">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Mon profil
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Dashboard Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" className="flex items-center text-white hover:bg-white/10 transition-colors px-2 py-1">
                  <span className="text-sm">Connexion</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        {/* Menu hamburger comme FlixBus */}
        <div className="flex items-center px-2 py-2">
          {/* Bouton hamburger à gauche */}
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-white" />
            ) : (
              <Menu className="h-5 w-5 text-white" />
            )}
          </Button>
        </div>

        {/* Menu mobile déroulant */}
        {isMobileMenuOpen && (
          <div className="bg-white border-t border-orange-200 shadow-lg">
            <div className="py-4">
              <div className="space-y-1">
                {/* Menu Organisez votre voyage */}
                <div className="px-4 py-2 text-gray-500 text-sm font-medium">
                  {getContent('header', 'organize_trip', 'Organisez votre voyage')}
                </div>
                <Link 
                  to="/routes" 
                  className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MapPin className="h-4 w-4 mr-3" />
                  {getContent('header', 'organize_trip_search', 'Rechercher un trajet')}
                </Link>
                <Link 
                  to="/schedules" 
                  className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Bus className="h-4 w-4 mr-3" />
                  {getContent('header', 'organize_trip_schedules', 'Horaires & Tarifs')}
                </Link>
                <Link 
                  to="/destinations" 
                  className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MapPin className="h-4 w-4 mr-3" />
                  {getContent('header', 'organize_trip_destinations', 'Destinations populaires')}
                </Link>
                <Link 
                  to="/bus-stations" 
                  className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MapPin className="h-4 w-4 mr-3" />
                  {getContent('header', 'organize_trip_stations', 'Gares routières')}
                </Link>
                
                {/* Séparateur */}
                <div className="border-t border-gray-200 my-2"></div>
                
                <Link 
                  to="/services" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Services
                </Link>
                
                <button 
                  className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100"
                  onClick={handleTrackingClick}
                >
                  <Bus className="h-5 w-5 mr-3" />
                  Suivez un trajet
                </button>
                
                <Link 
                  to="/faq" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <HelpCircle className="h-5 w-5 mr-3" />
                  Aide
                </Link>

                <div className="border-t border-gray-200 my-2"></div>
                
                <div className="px-4 py-2">
                  <span className="text-sm font-medium text-gray-500 flex items-center">
                    🇫🇷 Français
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4 sm:px-6">
          {/* Logo - Always visible */}
          <div className="flex items-center">
            <Link to="/" className="text-xl sm:text-2xl font-bold tracking-wide hover:opacity-80 transition-opacity">
              GO MAROC
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="flex items-center space-x-2">
            {/* Organisez votre voyage */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1 text-white hover:bg-white/10 px-4 py-2 rounded-lg font-medium">
                  <span>{getContent('header', 'organize_trip', 'Organisez votre voyage')}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 py-4 bg-white dark:bg-gray-800 border shadow-lg z-50">
                <DropdownMenuItem asChild>
                  <Link to="/routes" className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {getContent('header', 'organize_trip_search', 'Rechercher un trajet')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/schedules" className="flex items-center">
                    <Bus className="h-4 w-4 mr-2" />
                    {getContent('header', 'organize_trip_schedules', 'Horaires & Tarifs')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/destinations" className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {getContent('header', 'organize_trip_destinations', 'Destinations populaires')}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Services */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1 text-white hover:bg-white/10 px-4 py-2 rounded-lg font-medium">
                  <span>{getContent('header', 'services', 'Services')}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 py-4 bg-white dark:bg-gray-800 border shadow-lg z-50">
                <DropdownMenuItem asChild>
                  <Link to="/services#bagages" className="flex items-center">
                    <Bus className="h-4 w-4 mr-2" />
                    {getContent('header', 'services_baggage', 'Transport de bagages')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/services#assistance" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {getContent('header', 'services_assistance', 'Assistance passagers')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/services#premium" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    {getContent('header', 'services_premium', 'Services premium')}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Suivez un trajet */}
            <Button variant="ghost" className="text-white hover:bg-white/10 px-4 py-2 rounded-lg font-medium" onClick={handleTrackingClick}>
              {getContent('header', 'track_journey', 'Suivez un trajet')}
            </Button>

            {/* Aide */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/10 px-4 py-2 rounded-lg font-medium">
                  {getContent('header', 'help', 'Aide')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 py-4 bg-white dark:bg-gray-800 border shadow-lg z-50">
                <DropdownMenuItem asChild>
                  <Link to="/faq" className="flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    {getContent('header', 'help_faq', 'FAQ')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  // Essayer de trouver la section contact sur la page d'accueil
                  if (window.location.pathname === '/') {
                    const contactSection = document.querySelector('[class*="contact"]') || 
                                         document.querySelector('#contact') ||
                                         document.querySelector('#contact-form');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      // Si pas de section contact, scroll vers le footer
                      const footer = document.querySelector('footer');
                      if (footer) {
                        footer.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  } else {
                    // Si on n'est pas sur la page d'accueil, rediriger vers la page d'accueil avec scroll
                    window.location.href = '/#contact';
                  }
                }}>
                  <Phone className="h-4 w-4 mr-2" />
                  {getContent('header', 'help_contact', 'Nous contacter')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/terms" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    {getContent('header', 'help_terms', 'Conditions d\'utilisation')}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Language selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm">Français</span>
            </div>
            
            {/* User menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/10 px-3 py-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm hidden sm:inline">Mon compte</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 py-4 bg-white dark:bg-gray-800 border shadow-lg z-50">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Mon profil
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Dashboard Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/10 transition-colors px-3 py-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm">Connexion</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;