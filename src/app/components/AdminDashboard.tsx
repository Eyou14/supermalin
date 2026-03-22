import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Inbox,
  Trash2,
  Edit3,
  CheckCircle,
  ExternalLink,
  RefreshCcw,
  Handshake,
  AlertCircle,
  Plus,
  X,
  ShieldCheck,
  Gavel,
  Tag,
  Users,
  CreditCard,
  Wallet,
  Search,
  Mail,
  Phone,
  Calendar,
  Download,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from 'utils/supabase/info';
import { Product } from './ProductCard';
import { Logo } from './Logo';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e62e42f7`;
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseClient = createClient(supabaseUrl, publicAnonKey);
const STORAGE_BUCKET = 'Products';

interface TradeRequest {
  id: string;
  type: 'buyback' | 'consignment';
  device: string;
  email: string;
  createdAt: string;
  status?: 'pending' | 'received' | 'tested' | 'paid' | 'listed';
  model?: string;
  condition?: string;
}

interface UserProfileData {
  userId: string;
  name: string;
  email: string;
  balance: number;
  createdAt: string;
  avatar?: string;
}

interface TransactionData {
  id: string;
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  label: string;
  date: string;
  status: string;
}

const sanitizeFileName = (fileName: string) => {
  const ext = fileName.split('.').pop() || 'png';
  const base = fileName
    .replace(/\.[^/.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();

  return `${base}-${Date.now()}.${ext}`;
};

const uploadProductImages = async (files: File[]) => {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const fileName = sanitizeFileName(file.name);
    const filePath = fileName;

    const { error } = await supabaseClient.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed for ${file.name}: ${error.message}`);
    }

    const { data } = supabaseClient.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    uploadedUrls.push(data.publicUrl);
  }

  return uploadedUrls;
};

export const AdminDashboard = () => {

  const [activeTab, setActiveTab] = useState<'requests' | 'inventory' | 'users' | 'transactions' | 'orders'>('requests');
  const [requests, setRequests] = useState<TradeRequest[]>([]);
  const [inventory, setInventory] = useState<Product[]>([]);
const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [users, setUsers] = useState<UserProfileData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

 const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    const formData = new FormData(e.currentTarget);

    let imageUrls: string[] = [];

    // Upload images vers Supabase Storage
    for (const file of selectedFiles) {
      const fileName = `${Date.now()}-${file.name.replaceAll(" ", "-")}`;

     const { error } = await supabaseClient.storage
  .from(STORAGE_BUCKET)
  .upload(fileName, file);

const { data } = supabaseClient.storage
  .from(STORAGE_BUCKET)
  .getPublicUrl(fileName);

      imageUrls.push(data.publicUrl);
    }

    const productData = {
      name: formData.get("name") as string,
      price: parseFloat(formData.get("price") as string),
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      type: formData.get("type") as "direct" | "auction",
      condition: formData.get("condition") as string,
      stock: parseInt(formData.get("stock") as string) || 1,

      // 🔥 IMPORTANT
      image: imageUrls[0] || null,
      images: imageUrls,
    };

    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) throw new Error();

    toast.success("Produit ajouté avec images 🚀");
    setIsAddModalOpen(false);
    setSelectedFiles([]);
    fetchData();

  } catch (e) {
    console.error(e);
    toast.error("Erreur upload produit");
  }
};

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let endpoint = '';
      if (activeTab === 'requests') endpoint = '/requests';
      else if (activeTab === 'inventory') endpoint = '/products';
      else if (activeTab === 'users') endpoint = '/users';
      else if (activeTab === 'transactions') endpoint = '/transactions';
      else if (activeTab === 'orders') endpoint = '/orders';

      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();

      if (activeTab === 'requests') setRequests(Array.isArray(data) ? data : []);
      else if (activeTab === 'inventory') setInventory(Array.isArray(data) ? data : []);
      else if (activeTab === 'users') setUsers(Array.isArray(data) ? data : []);
      else if (activeTab === 'transactions') setTransactions(Array.isArray(data) ? data : []);
      else if (activeTab === 'orders') setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
    };

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        toast.success('Utilisateur créé avec succès');
        setIsUserModalOpen(false);
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors de la création');
      }
    } catch (error) {
      toast.error('Erreur de communication avec le serveur');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cet article ?')) return;
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      if (!response.ok) throw new Error();
      setInventory((prev) => prev.filter((p) => p.id !== id));
      toast.success('Article supprimé');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const requestStatuses = [
    { id: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'received', label: 'Reçu', color: 'bg-blue-100 text-blue-700' },
    { id: 'tested', label: 'Testé', color: 'bg-purple-100 text-purple-700' },
    { id: 'paid', label: 'Payé', color: 'bg-green-100 text-green-700' },
    { id: 'listed', label: 'En vente', color: 'bg-gray-100 text-gray-700' },
  ];

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`${API_URL}/requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error();
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: status as any } : r)));
      toast.success('Statut mis à jour');
    } catch (error) {
      toast.error('Erreur de mise à jour');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-gray-900 text-white flex flex-col sticky top-0 h-screen shrink-0">
        <div className="p-8 border-b border-white/10">
          <Logo light />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'requests', label: 'Demandes', icon: Inbox },
            { id: 'inventory', label: 'Inventaire', icon: Package },
            { id: 'orders', label: 'Commandes', icon: LayoutDashboard },
            { id: 'users', label: 'Utilisateurs', icon: Users },
            { id: 'transactions', label: 'Transactions', icon: CreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={20} /> {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Serveur Status</p>
            <div className="flex items-center gap-2 text-xs text-green-400 font-bold">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Opérationnel
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black text-gray-900">
              {activeTab === 'requests' && 'Rachats & Collaborations'}
              {activeTab === 'inventory' && 'Gestion du Catalogue'}
              {activeTab === 'users' && 'Gestion des Utilisateurs'}
              {activeTab === 'transactions' && 'Flux Financiers'}
              {activeTab === 'orders' && 'Gestion des Commandes'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-100 border-none rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 w-64"
              />
            </div>
            {activeTab === 'inventory' && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
              >
                <Plus size={18} /> Article
              </button>
            )}
            {activeTab === 'users' && (
              <button
                onClick={() => setIsUserModalOpen(true)}
                className="bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
              >
                <Plus size={18} /> Utilisateur
              </button>
            )}
            <button onClick={fetchData} className="p-2 text-gray-400 hover:text-orange-600 transition-all">
              <RefreshCcw size={20} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
            </div>
          ) : activeTab === 'orders' ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID Commande</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Articles</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-all">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{order.id}</span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(order.createdAt || order.created_at).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {(order.items || order.order_items || []).map((item: any, idx: number) => (
                            <span key={idx} className="text-xs text-gray-600">
                              • {item.name || item.product_title || item.title}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-black text-gray-900">
                          {(order.total || order.total_amount)?.toLocaleString()}€
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            order.status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {order.status === 'paid'
                            ? 'Payé'
                            : order.status === 'pending'
                            ? 'Attente'
                            : order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600">
                            <Eye size={18} />
                          </button>
                          {order.status === 'paid' && (
                            <button className="p-2 text-gray-400 hover:text-green-600">
                              <CheckCircle size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'users' ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Utilisateur</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Solde</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Inscrit le</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users
                    .filter(
                      (u) =>
                        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((user) => (
                      <tr key={user.userId} className="hover:bg-gray-50/50 transition-all group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar || `https://i.pravatar.cc/150?u=${user.userId}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="font-bold text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className="font-black text-orange-600">{(user.balance || 0).toFixed(2)}€</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-gray-400 hover:text-blue-600">
                            <Edit3 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'transactions' ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date & ID</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Libellé</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Montant</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Facture</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.map((tr) => (
                    <tr key={tr.id} className="hover:bg-gray-50/50 transition-all">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-900">{new Date(tr.date).toLocaleString()}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{tr.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${tr.type === 'credit' ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="text-sm font-bold text-gray-700">{tr.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-black ${tr.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {tr.type === 'credit' ? '+' : '-'}
                          {tr.amount.toFixed(2)}€
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">
                          {tr.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-400 hover:text-blue-600">
                          <Download size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'requests' ? (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        req.type === 'buyback' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {req.type === 'buyback' ? <RefreshCcw size={28} /> : <Handshake size={28} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{req.device}</h4>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="font-medium text-gray-700">{req.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <select
                      value={req.status || 'pending'}
                      onChange={(e) => updateRequestStatus(req.id, e.target.value)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border-none outline-none cursor-pointer ${
                        requestStatuses.find((s) => s.id === (req.status || 'pending'))?.color
                      }`}
                    >
                      {requestStatuses.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Produit</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Prix</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {inventory
                    .filter((i) =>
                      (i.title || i.name || '').toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((item) => {
                      const itemImage =
                        item.image_url ||
                        item.image ||
                        (item.images && item.images.length > 0 ? item.images[0] : '') ||
                        '';
                      const itemTitle = item.title || item.name || 'Produit';

                      return (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-all group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={itemImage}
                                className="w-10 h-10 rounded-xl object-cover bg-gray-100"
                              />
                              <span className="font-bold text-gray-900">{itemTitle}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold uppercase">
                            {item.type === 'auction' ? 'Enchère' : 'Direct'}
                          </td>
                          <td className="px-6 py-4 font-black">
                            {(item.type === 'auction' ? item.currentBid || item.price : item.price)?.toLocaleString()}€
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => deleteProduct(item.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <h2 className="text-2xl font-black mb-6">Ajouter un produit TEST 123</h2>
              <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Nom du produit</label>
                  <input
                    name="name"
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Prix (€)</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Stock</label>
                  <input
                    name="stock"
                    type="number"
                    defaultValue="1"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Images produit</label>
                  <input 
  type="file"
  multiple
  accept="image/*"
  onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm"
/>
                  <p className="text-xs text-gray-400">Vous pouvez sélectionner plusieurs images.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Catégorie</label>
                  <select
                    name="category"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
                  >
                    <option value="telephonie">Téléphonie</option>
                    <option value="informatique">Informatique</option>
                    <option value="cuisine">Cuisine</option>
                    <option value="maison">Maison</option>
                    <option value="vetements">Vêtements</option>
                    <option value="cosmetiques">Cosmétiques</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">État</label>
                  <select
                    name="condition"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
                  >
                    <option value="Neuf scellé">Neuf scellé</option>
                    <option value="Neuf ouvert">Neuf ouvert</option>
                    <option value="Comme neuf">Comme neuf</option>
                    <option value="Très bon état">Très bon état</option>
                    <option value="Bon état">Bon état</option>
                    <option value="Correct">Correct</option>
                    <option value="Pour pièces">Pour pièces</option>
                  </select>
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none resize-none"
                  />
                </div>

                <div className="col-span-1 flex items-center gap-2">
                  <input type="checkbox" name="isNewArrival" id="isNewArrival" />
                  <label htmlFor="isNewArrival" className="text-sm font-medium">
                    Nouvel arrivage
                  </label>
                </div>

                <div className="col-span-1 flex items-center gap-2">
                  <input type="checkbox" name="isFeatured" id="isFeatured" />
                  <label htmlFor="isFeatured" className="text-sm font-medium">
                    Produit mis en avant
                  </label>
                </div>

                <button
                  type="submit"
                  className="col-span-2 bg-orange-600 text-white py-4 rounded-xl font-bold mt-4 hover:bg-orange-700 transition-all"
                >
                  Publier l'article
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isUserModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsUserModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl"
            >
              <h2 className="text-2xl font-black mb-6">Créer un utilisateur</h2>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Nom complet</label>
                  <input
                    name="name"
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Mot de passe</label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold mt-4 hover:bg-orange-700 transition-all"
                >
                  Créer le compte
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};