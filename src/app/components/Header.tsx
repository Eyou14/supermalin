import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Search, ShoppingCart, User, Gavel, LayoutGrid, Info, HelpCircle, Menu, X, Zap, ShieldCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "./Logo";
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e62e42f7`;

export const Header = ({ 
  cartCount, 
  onNavigate, 
  onAuthOpen,
  isLoggedIn = false,
  isAdmin = false,
  user = null,
  profile = null
}: { 
  cartCount: number; 
  onNavigate: (page: string) => void;
  onAuthOpen: () => void;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  user?: any;
  profile?: any;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'home', label: 'Accueil', icon: LayoutGrid, path: '/' },
    { id: 'shop', label: 'Boutique', icon: ShoppingCart, path: '/boutique' },
    { id: 'nouveaux-arrivages', label: 'Arrivages', icon: Zap, path: '/nouveaux-arrivages' },
    { id: 'contact', label: 'Contact', icon: Info, path: '/contact' },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: ShieldCheck, path: '/admin' }] : []),
  ];

  const handleUserClick = () => {
    if (isLoggedIn) {
      navigate('/profil');
    } else {
      onAuthOpen();
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length > 2) {
      setIsSearching(true);
      fetchSearchResults(value);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const fetchSearchResults = async (query: string) => {
    try {
      const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setSearchResults(data);
      setShowSearchResults(data.length > 0);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/boutique/${productId}`);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim().length > 0) {
      navigate(`/boutique?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  useEffect(() => {
    const currentRef = searchRef.current;
    const handleClickOutside = (event: MouseEvent) => {
      if (currentRef && !currentRef.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div onClick={() => onNavigate('home')}>
          <Logo />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isActive(item.path) 
                  ? 'bg-orange-50 text-orange-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.label}
            </button>
          ))}
          
        </nav>

        {/* Search - Desktop */}
        <div className="hidden lg:flex flex-1 max-w-md items-center relative" ref={searchRef}>
          <Search className="absolute left-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un produit, une marque..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
          />
          {isSearching && (
            <div className="absolute left-0 top-full w-full bg-white border border-gray-200 rounded-b-lg shadow-lg z-10">
              <div className="p-2 text-gray-500 text-sm">Recherche en cours...</div>
            </div>
          )}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute left-0 top-full w-full bg-white border border-gray-200 rounded-b-lg shadow-lg z-10">
              <div className="p-2">
                {searchResults.map((result, index) => (
                  <div key={index} className="py-1 px-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleProductClick(result.id)}>
                    {result.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleUserClick}
            className={`rounded-full transition-colors relative group ${
              isActive('/profil') ? 'ring-2 ring-orange-500' : 'hover:ring-2 hover:ring-gray-200'
            }`}
          >
            {user && profile ? (
              <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 overflow-hidden border-2 border-white shadow-sm">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-black">
                    {(profile?.firstName?.[0] || profile?.name?.[0] || 'U').toUpperCase()}
                    {(profile?.lastName?.[0] || profile?.name?.split(' ')[1]?.[0] || '').toUpperCase()}
                  </span>
                )}
              </div>
            ) : (
              <div className="p-2">
                <User size={22} className="text-gray-600" />
              </div>
            )}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">Mon Compte</span>
          </button>
          
          <button 
            onClick={() => onNavigate('cart')}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors relative group"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Panier</span>
          </button>

          <button 
            className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              <form onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(); setIsMenuOpen(false); }} className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </form>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium ${
                    isActive(item.path) 
                      ? 'bg-orange-50 text-orange-700' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    handleUserClick();
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium ${
                    isActive('/profil') ? 'bg-orange-50 text-orange-700' : 'text-gray-600'
                  }`}
                >
                  <User size={18} />
                  Mon Compte
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};