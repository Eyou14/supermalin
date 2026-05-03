import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ProductCard, Product } from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../mockData';
import { AppContext } from '../layouts/RootLayout';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Filter, ChevronDown, X } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e62e42f7`;

const categories = [
  { name: 'Toutes', slug: '' },
  { name: 'Téléphonie', slug: 'telephonie' },
  { name: 'Informatique', slug: 'informatique' },
  { name: 'Audio / Vidéo', slug: 'audio-video' },
  { name: 'Gaming', slug: 'gaming' },
  { name: 'Maison', slug: 'maison' },
  { name: 'Cuisine', slug: 'cuisine' },
  { name: 'Vêtements', slug: 'vetements' },
  { name: 'Cosmétiques', slug: 'cosmetiques' },
  { name: 'Accessoires', slug: 'accessoires' },
  { name: 'Divers Arrivages', slug: 'divers' },
];

const conditions = ['Neuf', 'Comme neuf', 'Très bon état', 'Bon état', 'Correct'];
const sortOptions = [
  { label: 'Nouveautés', value: 'newest' },
  { label: 'Prix croissant', value: 'price-asc' },
  { label: 'Prix décroissant', value: 'price-desc' },
  { label: 'Nom A-Z', value: 'name-asc' },
];

export const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, wishlist, toggleWishlist } = useContext(AppContext);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categorie') || '');
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('categorie') || '';
    const search = searchParams.get('search') || '';
    setSelectedCategory(cat);
    setSearchQuery(search);
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`Server error ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(MOCK_PRODUCTS);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
      setProducts(MOCK_PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    if (selectedCategory && p.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    if (selectedCondition && p.condition !== selectedCondition) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (inStockOnly && (!p.stock || p.stock === 0)) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'newest':
      default:
        return 0;
    }
  });

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (product.stock === 0) {
      toast.error("Produit en rupture de stock");
      return;
    }
    addToCart(product);
    toast.success(`${product.name} ajouté au panier !`, {
      action: {
        label: 'Voir Panier',
        onClick: () => navigate('/panier')
      }
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    toggleWishlist(productId);
    if (wishlist?.includes(productId)) {
      toast.info("Retiré des favoris");
    } else {
      toast.success("Ajouté aux favoris !");
    }
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedCondition('');
    setPriceRange([0, 10000]);
    setInStockOnly(false);
    setSortBy('newest');
    setSearchParams({});
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedCondition,
    inStockOnly,
  ].filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black mb-2">Boutique</h1>
          <p className="text-gray-600">{sortedProducts.length} produits disponibles</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all lg:hidden"
        >
          <Filter size={20} />
          Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:block ${showFilters ? 'block' : 'hidden'} bg-white border-2 border-gray-200 rounded-3xl p-6 h-fit sticky top-24`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black flex items-center gap-2">
              <Filter size={20} />
              Filtres
            </h2>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-sm text-orange-600 hover:underline flex items-center gap-1"
              >
                <X size={16} />
                Réinitialiser
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">Catégorie</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    if (cat.slug) {
                      setSearchParams({ categorie: cat.slug });
                    } else {
                      setSearchParams({});
                    }
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                    selectedCategory === cat.slug
                      ? 'bg-orange-600 text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">État</h3>
            <div className="space-y-2">
              {conditions.map((cond) => (
                <label key={cond} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    checked={selectedCondition === cond}
                    onChange={() => setSelectedCondition(selectedCondition === cond ? '' : cond)}
                    className="w-4 h-4 text-orange-600 focus:ring-orange-600"
                  />
                  <span className="text-sm">{cond}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">Prix</h3>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="10000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>0€</span>
                <span>{priceRange[1]}€</span>
              </div>
            </div>
          </div>

          {/* Stock Filter */}
          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-orange-600 focus:ring-orange-600 rounded"
              />
              <span className="text-sm font-medium">En stock uniquement</span>
            </label>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Sort */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
              {sortedProducts.length} résultat{sortedProducts.length > 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Trier par:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-2 border-gray-200 rounded-lg px-4 py-2 font-medium focus:outline-none focus:border-orange-600"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-4">Aucun produit trouvé</p>
              <button
                onClick={resetFilters}
                className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={() => navigate(`/boutique/${product.id}`)}
                  onAction={(e) => handleAddToCart(e, product)}
                  onWishlist={(e) => handleToggleWishlist(e, product.id)}
                  isWishlisted={wishlist?.includes(product.id) || false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};