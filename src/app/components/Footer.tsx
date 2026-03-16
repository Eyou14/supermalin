import { Gavel, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router";
import { Logo } from "./Logo";
const hdfLogo = "/placeholder-hdf.png";

export const Footer = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      // Fallback direct navigation
      const routes: Record<string, string> = {
        'home': '/',
        'shop': '/boutique',
        'auctions': '/encheres',
        'profile': '/profil',
        'contact': '/contact',
        'cgv': '/cgv',
        'mentions': '/mentions-legales',
        'privacy': '/politique-confidentialite',
        'returns': '/politique-retours',
      };
      navigate(routes[page] || '/');
    }
  };

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Logo />
            <p className="text-gray-500 text-sm leading-relaxed">
              Plateforme française de déstockage. Arrivages fréquents, prix justes et transparents.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-gray-50 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Plateforme</h4>
            <ul className="space-y-4">
              {[
                { label: 'Accueil', id: 'home' },
                { label: 'Boutique', id: 'shop' },
                { label: 'Mon Compte', id: 'profile' },
                { label: 'Contact', id: 'contact' }
              ].map((item) => (
                <li key={item.id}>
                  <button 
                    onClick={() => handleNavigate(item.id)}
                    className="text-gray-500 hover:text-orange-600 text-sm transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Informations Légales</h4>
            <ul className="space-y-4">
              {[
                { label: 'CGV', id: 'cgv' },
                { label: 'Mentions Légales', id: 'mentions' },
                { label: 'Confidentialité', id: 'privacy' },
                { label: 'Retours', id: 'returns' }
              ].map((item) => (
                <li key={item.id}>
                  <button 
                    onClick={() => handleNavigate(item.id)}
                    className="text-gray-500 hover:text-orange-600 text-sm transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-orange-500 mt-0.5" />
                <a href="mailto:contact@supermalin.fr" className="text-gray-500 hover:text-orange-600 text-sm transition-colors">
                  contact@supermalin.fr
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-orange-500 mt-0.5" />
                <a href="tel:0977454776" className="text-gray-500 hover:text-orange-600 text-sm transition-colors">
                  0977454776
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-orange-500 mt-0.5" />
                <span className="text-gray-500 text-sm">Hauts-de-France</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Partner Section */}
        <div className="mb-12 flex items-center justify-center gap-8 p-6 bg-blue-50 rounded-2xl">
          <img src={hdfLogo} alt="Région Hauts-de-France" className="h-12" />
          <p className="text-sm text-gray-700 max-w-md">
            SuperMalin est soutenu par la <strong>Région Hauts-de-France</strong> dans le cadre de son développement.
          </p>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs">
            © 2026 SuperMalin SAS. Tous droits réservés. • SIRET: 92822322100013
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-400">Paiement sécurisé par</span>
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5 opacity-60 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </footer>
  );
};