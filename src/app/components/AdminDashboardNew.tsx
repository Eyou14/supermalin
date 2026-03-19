import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  TrendingUp,
  Download,
  Plus,
  Edit3,
  Trash2,
  Search,
  Eye,
  CheckCircle,
  X,
  Package2,
  AlertTriangle,
  Calendar,
  RefreshCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Product } from './ProductCard';
import { useNavigate } from 'react-router';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e62e42f7`

type TabType = 'dashboard' | 'products' | 'orders' | 'stock' | 'sections';

export const AdminDashboardNew: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

const [orderSearch, setOrderSearch] = useState('');
const [orderStatusFilter, setOrderStatusFilter] = useState('all');
const [currentOrderPage, setCurrentOrderPage] = useState(1);
const ORDERS_PER_PAGE = 10;

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const PRODUCTS_PER_PAGE = 10;

  const [sectionConfig, setSectionConfig] = useState({
    newLotsTitle: 'Nouveaux Lots',
    newLotsDescription: 'Découvrez nos derniers arrivages',
    newArrivalsTitle: 'Derniers Arrivages',
    newArrivalsDescription: 'Produits fraîchement ajoutés au catalogue',
    featuredProductIds: [] as string[],
    badges: {
      nouveau: true,
      arrivage: true,
      stockLimite: false,
    },
    bannerMessage1: 'Derniers arrivages : +250 produits cette semaine',
    bannerMessage2: '120 MacBook Pro M3',
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

useEffect(() => {
  setCurrentOrderPage(1);
}, [orderSearch, orderStatusFilter]);

  useEffect(() => {
    loadSectionConfig();
  }, []);

  useEffect(() => {
    setCurrentProductPage(1);
  }, [productSearch, productCategoryFilter]);

  const loadSectionConfig = async () => {
    try {
      const response = await fetch(`${API_URL}/sections`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      if (response.ok) {
        const config = await response.json();
        setSectionConfig(config);
      }
    } catch (error) {
      console.error('Error loading section config:', error);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'products' || activeTab === 'stock' || activeTab === 'dashboard') {
        const response = await fetch(`${API_URL}/products`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(Array.isArray(data) ? data : []);
        }
      }

      if (activeTab === 'orders' || activeTab === 'dashboard') {
        const response = await fetch(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(Array.isArray(data) ? data : []);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur de chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const productData = {
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      condition: formData.get('condition') as Product['condition'],
      stock: parseInt(formData.get('stock') as string, 10),
      image:
        (formData.get('image') as string) ||
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      description: formData.get('description') as string,
      type: 'direct' as const,
      tested: true,
    };

    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success('Produit ajouté avec succès');
        setIsAddProductModalOpen(false);
        fetchData();
      } else {
        toast.error("Erreur lors de l'ajout du produit");
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error("Erreur lors de l'ajout du produit");
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    try {
      const response = await fetch(`${API_URL}/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        toast.success('Produit mis à jour');
        setEditingProduct(null);
        fetchData();
      } else {
        toast.error('Erreur de mise à jour');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Erreur de mise à jour');
    }
  };


const filteredOrders = orders.filter((order) => {
  const search = orderSearch.toLowerCase();

  const matchesSearch =
    order.id?.toLowerCase().includes(search) ||
    order.shippingInfo?.name?.toLowerCase().includes(search) ||
    order.shippingInfo?.email?.toLowerCase().includes(search);

  const matchesStatus =
    orderStatusFilter === 'all' || order.status === orderStatusFilter;

  return matchesSearch && matchesStatus;
});

const totalOrderPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));

const paginatedOrders = filteredOrders.slice(
  (currentOrderPage - 1) * ORDERS_PER_PAGE,
  currentOrderPage * ORDERS_PER_PAGE
);



  const handleArchiveProduct = async (productId: string) => {
    if (!confirm('Archiver ce produit ?')) return;

    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });

      if (response.ok) {
        toast.success('Produit archivé');
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur d’archivage');
      }
    } catch (error) {
      console.error('Error archiving product:', error);
      toast.error('Erreur d’archivage');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;

      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ ...order, status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Commande ${orderId} mise à jour`);
        fetchData();
      } else {
        toast.error('Erreur de mise à jour');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Erreur de mise à jour');
    }
  };

  const exportOrdersToCSV = () => {
    const headers = ['N° Commande', 'Date', 'Client', 'Total', 'Statut', 'Livraison'];
    const rows = orders.map((order) => [
      order.id,
      new Date(order.createdAt).toLocaleDateString('fr-FR'),
      order.shippingInfo?.name || 'N/A',
      `${order.total}€`,
      order.status,
      order.shippingMethod || 'N/A',
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `commandes-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Export CSV téléchargé');
  };

  const handleSaveSectionConfig = async () => {
    try {
      const response = await fetch(`${API_URL}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(sectionConfig),
      });

      if (response.ok) {
        toast.success('Configurations des sections sauvegardées');
      } else {
        toast.error('Erreur de sauvegarde');
      }
    } catch (error) {
      console.error('Error saving section config:', error);
      toast.error('Erreur de sauvegarde');
    }
  };

  const stats = {
    totalRevenue: orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0),
    totalOrders: orders.length,
    totalProducts: products.length,
    lowStockProducts: products.filter((p) => (p.stock || 0) < 5).length,
  };

  const monthlyRevenue = orders
    .filter((o) => new Date(o.createdAt).getMonth() === new Date().getMonth())
    .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

  const productCategories = [
    'all',
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(productSearch.toLowerCase());

    const matchesCategory =
      productCategoryFilter === 'all' || product.category === productCategoryFilter;



    return matchesSearch && matchesCategory;
  });

  const totalProductPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );

  const paginatedProducts = filteredProducts.slice(
    (currentProductPage - 1) * PRODUCTS_PER_PAGE,
    currentProductPage * PRODUCTS_PER_PAGE
  );

  if (isLoading && activeTab === 'dashboard') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">Administration SuperMalin</h1>
        <p className="text-gray-600">Gestion complète de la plateforme</p>
      </div>

      <div className="flex items-center gap-2 mb-8 border-b border-gray-200 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
          { id: 'products', label: 'Produits', icon: Package },
          { id: 'orders', label: 'Commandes', icon: ShoppingBag },
          { id: 'stock', label: 'Stock', icon: Package2 },
          { id: 'sections', label: 'Sections', icon: Sparkles },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-4 py-3 font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <tab.icon size={20} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6">
              <div className="flex justify-between items-center mb-2">
                <TrendingUp size={20} className="opacity-80" />
              </div>
              <h3 className="text-sm opacity-90 mb-1">CA Total</h3>
              <p className="text-3xl font-black">{stats.totalRevenue.toFixed(2)}€</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6">
              <div className="flex justify-between items-center mb-2">
                <Calendar size={20} className="opacity-80" />
                <TrendingUp size={20} className="opacity-80" />
              </div>
              <h3 className="text-sm opacity-90 mb-1">CA ce mois</h3>
              <p className="text-3xl font-black">{monthlyRevenue.toFixed(2)}€</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <ShoppingBag size={32} />
              </div>
              <h3 className="text-sm opacity-90 mb-1">Commandes</h3>
              <p className="text-3xl font-black">{stats.totalOrders}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Package size={32} />
                {stats.lowStockProducts > 0 && (
                  <AlertTriangle size={20} className="opacity-80" />
                )}
              </div>
              <h3 className="text-sm opacity-90 mb-1">Produits</h3>
              <p className="text-3xl font-black">{stats.totalProducts}</p>
              {stats.lowStockProducts > 0 && (
                <p className="text-xs mt-2 opacity-90">
                  {stats.lowStockProducts} en stock faible
                </p>
              )}
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-black mb-4">Commandes Récentes Aujour </h2>
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div>
                    <p className="font-bold">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.shippingInfo?.name || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-orange-600">{order.total}€</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Catalogue</h2>
              <p className="text-sm text-gray-500">{filteredProducts.length} produit(s)</p>
            </div>

            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all"
            >
              <Plus size={20} />
              Ajouter un produit
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
              />

              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
              >
                {productCategories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Toutes les catégories' : category}
                  </option>
                ))}
              </select>

              <div className="flex items-center text-sm text-gray-500">
                Page {currentProductPage} / {totalProductPages}
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 font-bold text-sm">Produit</th>
                    <th className="text-left px-6 py-4 font-bold text-sm">Catégorie</th>
                    <th className="text-left px-6 py-4 font-bold text-sm">Prix</th>
                    <th className="text-left px-6 py-4 font-bold text-sm">Stock</th>
                    <th className="text-left px-6 py-4 font-bold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                        Aucun produit trouvé
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                            />
                            <div>
                              <p className="font-bold">{product.name}</p>
                              <p className="text-xs text-gray-500">
                                {product.description || product.condition || 'Sans description'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm">{product.category || '-'}</td>

                        <td className="px-6 py-4 font-bold text-orange-600">
                          {Number(product.price || 0).toFixed(2)}€
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              (product.stock || 0) === 0
                                ? 'bg-red-100 text-red-700'
                                : (product.stock || 0) < 5
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {product.stock || 0}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/boutique/${product.id}`)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Voir sur le site"
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              onClick={() => setEditingProduct(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit3 size={16} />
                            </button>

                            <button
                              onClick={() => handleArchiveProduct(product.id)}
                              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Archiver"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentProductPage((p) => Math.max(1, p - 1))}
              disabled={currentProductPage === 1}
              className="px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-50"
            >
              Précédent
            </button>

            <button
              onClick={() =>
                setCurrentProductPage((p) => Math.min(totalProductPages, p + 1))
              }
              disabled={currentProductPage === totalProductPages}
              className="px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      

{activeTab === 'orders' && (
  <div className="space-y-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-2xl font-black">Gestion des Commandes</h2>
        <p className="text-sm text-gray-500">{filteredOrders.length} commande(s)</p>
      </div>

      <button
        onClick={exportOrdersToCSV}
        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-all"
      >
        <Download size={20} />
        Export CSV
      </button>
    </div>

    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Rechercher une commande..."
          value={orderSearch}
          onChange={(e) => setOrderSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
        />

        <select
          value={orderStatusFilter}
          onChange={(e) => setOrderStatusFilter(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="paid">Payé</option>
          <option value="shipped">Expédié</option>
          <option value="delivered">Livré</option>
          <option value="cancelled">Annulé</option>
        </select>

        <div className="flex items-center text-sm text-gray-500">
          Page {currentOrderPage} / {totalOrderPages}
        </div>
      </div>
    </div>

    <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 font-bold text-sm">N° Commande</th>
              <th className="text-left px-6 py-4 font-bold text-sm">Client</th>
              <th className="text-left px-6 py-4 font-bold text-sm">Date</th>
              <th className="text-left px-6 py-4 font-bold text-sm">Total</th>
              <th className="text-left px-6 py-4 font-bold text-sm">Livraison</th>
              <th className="text-left px-6 py-4 font-bold text-sm">Statut</th>
              <th className="text-left px-6 py-4 font-bold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                  Aucune commande trouvée
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm font-bold">{order.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{order.shippingInfo?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{order.shippingInfo?.email || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 font-bold text-orange-600">
                    {Number(order.total || 0).toFixed(2)}€
                  </td>
                  <td className="px-6 py-4 text-sm">{order.shippingMethod || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className="px-3 py-1 rounded-lg text-xs font-bold border-2 border-gray-200 focus:outline-none focus:border-orange-600"
                    >
                      <option value="pending">En attente</option>
                      <option value="paid">Payé</option>
                      <option value="shipped">Expédié</option>
                      <option value="delivered">Livré</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir détails"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => setCurrentOrderPage((p) => Math.max(1, p - 1))}
        disabled={currentOrderPage === 1}
        className="px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-50"
      >
        Précédent
      </button>

      <button
        onClick={() => setCurrentOrderPage((p) => Math.min(totalOrderPages, p + 1))}
        disabled={currentOrderPage === totalOrderPages}
        className="px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-50"
      >
        Suivant
      </button>
    </div>
  </div>
)}


      {activeTab === 'stock' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-black">Gestion du Stock</h2>

          {stats.lowStockProducts > 0 && (
            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 flex items-start gap-4">
              <AlertTriangle className="text-orange-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-orange-900 mb-1">Alerte Stock Bas</h3>
                <p className="text-sm text-orange-700">
                  {stats.lowStockProducts} produit(s) ont un stock inférieur à 5 unités
                </p>
              </div>
            </div>
          )}

          <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 font-bold text-sm">Produit</th>
                    <th className="text-left px-6 py-4 font-bold text-sm">Catégorie</th>
                    <th className="text-left px-6 py-4 font-bold text-sm">Stock Actuel</th>
                    <th className="text-left px-6 py-4 font-bold text-sm">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .slice()
                    .sort((a, b) => (a.stock || 0) - (b.stock || 0))
                    .map((product) => (
                      <tr key={product.id} className="border-b border-gray-100">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <p className="font-medium">{product.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">{product.category}</td>
                        <td className="px-6 py-4">
                          <span className="font-black text-lg">{product.stock || 0}</span>
                        </td>
                        <td className="px-6 py-4">
                          {(product.stock || 0) === 0 ? (
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                              Rupture
                            </span>
                          ) : (product.stock || 0) < 5 ? (
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                              Stock bas
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                              Disponible
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sections' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">Gestion des Sections</h2>
            <button
              onClick={handleSaveSectionConfig}
              className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl"
            >
              <CheckCircle size={20} />
              Sauvegarder les modifications
            </button>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
              <Sparkles className="text-orange-600" size={24} />
              Nouveaux Lots
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Titre de la section</label>
                <input
                  type="text"
                  value={sectionConfig.newLotsTitle}
                  onChange={(e) =>
                    setSectionConfig({ ...sectionConfig, newLotsTitle: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Description</label>
                <input
                  type="text"
                  value={sectionConfig.newLotsDescription}
                  onChange={(e) =>
                    setSectionConfig({ ...sectionConfig, newLotsDescription: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
              <Package2 className="text-blue-600" size={24} />
              Derniers Arrivages
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Titre de la section</label>
                <input
                  type="text"
                  value={sectionConfig.newArrivalsTitle}
                  onChange={(e) =>
                    setSectionConfig({ ...sectionConfig, newArrivalsTitle: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Description</label>
                <input
                  type="text"
                  value={sectionConfig.newArrivalsDescription}
                  onChange={(e) =>
                    setSectionConfig({
                      ...sectionConfig,
                      newArrivalsDescription: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-black mb-4">Produits en vedette</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold">Produits</label>
                <select
                  multiple
                  value={sectionConfig.featuredProductIds}
                  onChange={(e) =>
                    setSectionConfig({
                      ...sectionConfig,
                      featuredProductIds: Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      ),
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600"
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-black mb-4">Badges</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold">Nouveau</label>
                <input
                  type="checkbox"
                  checked={sectionConfig.badges.nouveau}
                  onChange={(e) =>
                    setSectionConfig({
                      ...sectionConfig,
                      badges: { ...sectionConfig.badges, nouveau: e.target.checked },
                    })
                  }
                  className="w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold">Arrivage</label>
                <input
                  type="checkbox"
                  checked={sectionConfig.badges.arrivage}
                  onChange={(e) =>
                    setSectionConfig({
                      ...sectionConfig,
                      badges: { ...sectionConfig.badges, arrivage: e.target.checked },
                    })
                  }
                  className="w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold">Stock limité</label>
                <input
                  type="checkbox"
                  checked={sectionConfig.badges.stockLimite}
                  onChange={(e) =>
                    setSectionConfig({
                      ...sectionConfig,
                      badges: { ...sectionConfig.badges, stockLimite: e.target.checked },
                    })
                  }
                  className="w-4 h-4"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
              <Zap className="text-purple-600" size={24} />
              Messages Bannière Page d'Accueil
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Message 1 (Badge haut)</label>
                <input
                  type="text"
                  value={sectionConfig.bannerMessage1}
                  onChange={(e) =>
                    setSectionConfig({ ...sectionConfig, bannerMessage1: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">
                  Message 2 (Nouveau lot arrivé)
                </label>
                <input
                  type="text"
                  value={sectionConfig.bannerMessage2}
                  onChange={(e) =>
                    setSectionConfig({ ...sectionConfig, bannerMessage2: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600 font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isAddProductModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsAddProductModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black">Ajouter un Produit</h2>
                <button
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Nom du produit *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600"
                    placeholder="iPhone 15 Pro Max 256GB..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Prix (€) *</label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600"
                      placeholder="299.99"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600"
                      placeholder="10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Catégorie *</label>
                    <select
                      name="category"
                      required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600"
                    >
                      <option value="telephonie">Téléphonie</option>
                      <option value="informatique">Informatique</option>
                      <option value="audio-video">Audio / Vidéo</option>
                      <option value="gaming">Gaming</option>
                      <option value="maison">Maison</option>
                      <option value="cuisine">Cuisine</option>
                      <option value="vetements">Vêtements</option>
                      <option value="cosmetiques">Cosmétiques</option>
                      <option value="accessoires">Accessoires</option>
                      <option value="divers">Divers Arrivages</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">État *</label>
                    <select
                      name="condition"
                      required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600"
                    >
                      <option value="Neuf">Neuf</option>
                      <option value="Comme neuf">Comme neuf</option>
                      <option value="Très bon état">Très bon état</option>
                      <option value="Bon état">Bon état</option>
                      <option value="Correct">Correct</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">URL Image</label>
                  <input
                    type="url"
                    name="image"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600 resize-none"
                    placeholder="Description détaillée du produit..."
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-all"
                  >
                    Ajouter le produit
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddProductModalOpen(false)}
                    className="px-6 py-3 border-2 border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setEditingProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black">Modifier le Produit</h2>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Nom du produit</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Prix (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Stock</label>
                    <input
                      type="number"
                      value={editingProduct.stock || 0}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stock: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Catégorie</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, category: e.target.value })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600"
                    >
                      <option value="telephonie">Téléphonie</option>
                      <option value="informatique">Informatique</option>
                      <option value="audio-video">Audio / Vidéo</option>
                      <option value="gaming">Gaming</option>
                      <option value="maison">Maison</option>
                      <option value="cuisine">Cuisine</option>
                      <option value="vetements">Vêtements</option>
                      <option value="cosmetiques">Cosmétiques</option>
                      <option value="accessoires">Accessoires</option>
                      <option value="divers">Divers Arrivages</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">État</label>
                    <select
                      value={editingProduct.condition}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          condition: e.target.value as Product['condition'],
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600"
                    >
                      <option value="Neuf">Neuf</option>
                      <option value="Comme neuf">Comme neuf</option>
                      <option value="Très bon état">Très bon état</option>
                      <option value="Bon état">Bon état</option>
                      <option value="Correct">Correct</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">URL Image</label>
                  <input
                    type="url"
                    value={editingProduct.image}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, image: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={(editingProduct as any).description || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      } as Product)
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600 resize-none"
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    onClick={() => handleUpdateProduct(editingProduct)}
                    className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-all"
                  >
                    Enregistrer les modifications
                  </button>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="px-6 py-3 border-2 border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};