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
  Eye,
  Truck,
  Send,
  Archive,
  BadgeCheck,
  PackageCheck,
  Percent,
  ToggleLeft,
  ToggleRight,
  Smartphone,
  PhoneCall,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from 'utils/supabase/info';
import { Product } from './ProductCard';
import { Logo } from './Logo';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e62e42f7`;
const supabaseClient = createClient(`https://${projectId}.supabase.co`, publicAnonKey);
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

// Helper: récupère le JWT de la session admin courante pour les routes /admin/*
const getAdminToken = async (): Promise<string> => {
  const { data } = await supabaseClient.auth.getSession();
  return data.session?.access_token || publicAnonKey;
};

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'inventory' | 'users' | 'transactions' | 'orders' | 'customization' | 'arrivals' | 'promos' | 'depot-vente'>('requests');
  const [requests, setRequests] = useState<TradeRequest[]>([]);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [editSelectedFiles, setEditSelectedFiles] = useState<File[]>([]);
  const [editExistingImages, setEditExistingImages] = useState<string[]>([]);
  const [users, setUsers] = useState<UserProfileData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfileData | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserBalance, setEditUserBalance] = useState('');
  const [editUserRole, setEditUserRole] = useState<'user' | 'admin'>('user');
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [shippingOrder, setShippingOrder] = useState<any | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('Colissimo');
  const [isShipping, setIsShipping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionsConfig, setSectionsConfig] = useState({
    bannerMessage1: 'Derniers arrivages : +250 produits cette semaine',
    bannerMessage2: '120 MacBook Pro M3',
  });
  const [isSavingSections, setIsSavingSections] = useState(false);

  // ── Codes Promo ────────────────────────────────────────────────────────────
  const [promos, setPromos] = useState<any[]>([]);
  const [isCreatingPromo, setIsCreatingPromo] = useState(false);
  const [newPromo, setNewPromo] = useState({
    code: '',
    type: 'fixed' as 'fixed' | 'percent',
    amount: '',
    min_order: '',
    max_uses: '',
    expires_at: '',
  });

  const fetchPromos = async () => {
    try {
      const token = await getAdminToken();
      const res = await fetch(`${API_URL}/admin/promos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setPromos(await res.json());
    } catch (e) {
      console.error('Error fetching promos:', e);
    }
  };

  const handleCreatePromo = async () => {
    if (!newPromo.code || !newPromo.amount) {
      toast.error('Code et montant obligatoires');
      return;
    }
    setIsCreatingPromo(true);
    try {
      const token = await getAdminToken();
      const res = await fetch(`${API_URL}/admin/promos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...newPromo,
          amount: Number(newPromo.amount),
          min_order: Number(newPromo.min_order) || 0,
          max_uses: newPromo.max_uses ? Number(newPromo.max_uses) : null,
          expires_at: newPromo.expires_at || null,
        }),
      });
      const data = await res.json();
      if (data.error) { toast.error(data.error); return; }
      setPromos((prev) => [...prev, data]);
      setNewPromo({ code: '', type: 'fixed', amount: '', min_order: '', max_uses: '', expires_at: '' });
      toast.success(`Code ${data.code} créé avec succès !`);
    } catch (e) {
      toast.error('Erreur lors de la création');
    } finally {
      setIsCreatingPromo(false);
    }
  };

  const handleTogglePromo = async (id: string, current: boolean) => {
    try {
      const token = await getAdminToken();
      await fetch(`${API_URL}/admin/promos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_active: !current }),
      });
      setPromos((prev) => prev.map((p) => p.id === id ? { ...p, is_active: !current } : p));
    } catch (e) {
      toast.error('Erreur de mise à jour');
    }
  };

  const handleDeletePromo = async (id: string, code: string) => {
    if (!confirm(`Supprimer le code ${code} ?`)) return;
    try {
      const token = await getAdminToken();
      await fetch(`${API_URL}/admin/promos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setPromos((prev) => prev.filter((p) => p.id !== id));
      toast.success('Code supprimé');
    } catch (e) {
      toast.error('Erreur de suppression');
    }
  };

  // ── Dépôt-Vente ───────────────────────────────────────────────────────────
  const [depotVenteList, setDepotVenteList] = useState<any[]>([]);
  const [isDepotVenteLoading, setIsDepotVenteLoading] = useState(false);

  const fetchDepotVente = async () => {
    setIsDepotVenteLoading(true);
    try {
      const token = await getAdminToken();
      const res = await fetch(`${API_URL}/admin/depot-vente`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setDepotVenteList(await res.json());
    } catch (e) {
      toast.error('Erreur chargement dépôt-vente');
    } finally {
      setIsDepotVenteLoading(false);
    }
  };

  const handleDepotVenteStatus = async (id: string, status: string) => {
    try {
      const token = await getAdminToken();
      await fetch(`${API_URL}/admin/depot-vente/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      setDepotVenteList((prev) => prev.map((s) => s.id === id ? { ...s, status } : s));
      toast.success('Statut mis à jour');
    } catch {
      toast.error('Erreur de mise à jour');
    }
  };

  const handleDepotVenteDelete = async (id: string) => {
    if (!confirm('Supprimer cette demande ?')) return;
    try {
      await fetch(`${API_URL}/admin/depot-vente/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      setDepotVenteList((prev) => prev.filter((s) => s.id !== id));
      toast.success('Demande supprimée');
    } catch {
      toast.error('Erreur de suppression');
    }
  };
  // ──────────────────────────────────────────────────────────────────────────

  // ── Arrivages ──────────────────────────────────────────────────────────────
  interface ArrivalLot {
    id: string;
    name: string;
    description: string;
    productCount: number;
    date: string;
    isActive: boolean;
    publishedAt?: string;
  }
  const [arrivals, setArrivals] = useState<ArrivalLot[]>([]);
  const [isArrivalsLoading, setIsArrivalsLoading] = useState(false);
  const [isCreatingArrival, setIsCreatingArrival] = useState(false);
  const [newArrivalForm, setNewArrivalForm] = useState({ name: '', description: '', productCount: '' });
  const [showArrivalForm, setShowArrivalForm] = useState(false);

  const loadArrivals = async () => {
    setIsArrivalsLoading(true);
    try {
      const res = await fetch(`${API_URL}/arrivals`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await res.json();
      setArrivals(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Erreur chargement arrivages');
    } finally {
      setIsArrivalsLoading(false);
    }
  };

  const createArrival = async () => {
    if (!newArrivalForm.name.trim()) { toast.error('Le nom du lot est requis'); return; }
    setIsCreatingArrival(true);
    try {
      const res = await fetch(`${API_URL}/arrivals`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${publicAnonKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newArrivalForm.name,
          description: newArrivalForm.description,
          productCount: Number(newArrivalForm.productCount) || 0,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success('Lot créé avec succès');
      setNewArrivalForm({ name: '', description: '', productCount: '' });
      setShowArrivalForm(false);
      loadArrivals();
    } catch {
      toast.error('Erreur lors de la création');
    } finally {
      setIsCreatingArrival(false);
    }
  };

  const publishArrival = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/arrivals/${id}/publish`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      if (!res.ok) throw new Error();
      toast.success('Lot publié ! La bannière a été mise à jour automatiquement.');
      loadArrivals();
      loadSectionsConfig();
    } catch {
      toast.error('Erreur lors de la publication');
    }
  };

  const deleteArrival = async (id: string) => {
    if (!confirm('Supprimer ce lot ?')) return;
    try {
      await fetch(`${API_URL}/arrivals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      toast.success('Lot supprimé');
      loadArrivals();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };
  // ──────────────────────────────────────────────────────────────────────────

  const handleShipOrder = async () => {
    if (!shippingOrder) return;
    setIsShipping(true);
    try {
      const response = await fetch(`${API_URL}/orders/${shippingOrder.id}/ship`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ trackingNumber: trackingNumber.trim() || null, carrier: carrier || null }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erreur serveur');
      }
      toast.success(`📦 Commande ${shippingOrder.id} marquée expédiée — email envoyé au client !`);
      setShippingOrder(null);
      setTrackingNumber('');
      setCarrier('Colissimo');
      // Rafraîchir les commandes
      const res = await fetch(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${publicAnonKey}` } });
      if (res.ok) setOrders(await res.json());
    } catch (e: any) {
      toast.error(e.message || 'Erreur lors de l\'expédition');
    } finally {
      setIsShipping(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      let imageUrls: string[] = [];

      // Upload images vers Supabase Storage
      for (const file of selectedFiles) {
        const fileName = `${Date.now()}-${file.name.replaceAll(' ', '-')}`;

        const { error } = await supabaseClient.storage
          .from(STORAGE_BUCKET)
          .upload(fileName, file);

        if (error) {
          throw new Error(`Échec upload ${file.name}: ${error.message}`);
        }

        const { data } = supabaseClient.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(fileName);

        imageUrls.push(data.publicUrl);
      }

      const originTag = formData.get('originTag') as string;
      const productData = {
        name: formData.get('name') as string,
        price: parseFloat(formData.get('price') as string),
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        type: formData.get('type') as 'direct' | 'auction',
        condition: formData.get('condition') as string,
        stock: parseInt(formData.get('stock') as string) || 1,
        tags: originTag ? [originTag] : [],
        image: imageUrls[0] || null,
        images: imageUrls,
      };

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error();

      toast.success('Produit ajouté avec images 🚀');
      setIsAddModalOpen(false);
      setSelectedFiles([]);
      fetchData();
    } catch (e) {
      console.error(e);
      toast.error('Erreur upload produit');
    }
  };

  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const formData = new FormData(e.currentTarget);

      // Upload new files
      const newImageUrls: string[] = [];
      for (const file of editSelectedFiles) {
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name.replaceAll(' ', '-')}`;
        const { error } = await supabaseClient.storage.from(STORAGE_BUCKET).upload(fileName, file);
        if (error) throw new Error(`Échec upload: ${error.message}`);
        const { data } = supabaseClient.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
        newImageUrls.push(data.publicUrl);
      }

      // Merge: kept existing images + new uploads
      const allImages = [...editExistingImages, ...newImageUrls];
      const imageUrl = allImages[0] || editingProduct.image_url || editingProduct.image || null;

      const editOriginTag = formData.get('originTag') as string;
      const updates = {
        name: formData.get('name') as string,
        price: parseFloat(formData.get('price') as string),
        originalPrice: formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : undefined,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        condition: formData.get('condition') as string,
        stock: parseInt(formData.get('stock') as string) || 0,
        is_active: parseInt(formData.get('stock') as string) > 0,
        is_featured: (formData.get('isFeatured') as string) === 'on',
        is_new_arrival: (formData.get('isNewArrival') as string) === 'on',
        tags: editOriginTag ? [editOriginTag] : [],
        ...(imageUrl ? { image_url: imageUrl } : {}),
        images: allImages,
      };

      const response = await fetch(`${API_URL}/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error();
      toast.success('Produit mis à jour ✅');
      setEditingProduct(null);
      setEditSelectedFiles([]);
      setEditExistingImages([]);
      fetchData();
    } catch (e) {
      console.error(e);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const loadSectionsConfig = async () => {
    try {
      const response = await fetch(`${API_URL}/sections`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      if (response.ok) {
        const config = await response.json();
        setSectionsConfig({
          bannerMessage1: config.bannerMessage1 || sectionsConfig.bannerMessage1,
          bannerMessage2: config.bannerMessage2 || sectionsConfig.bannerMessage2,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveSectionsConfig = async () => {
    setIsSavingSections(true);
    try {
      const response = await fetch(`${API_URL}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(sectionsConfig),
      });
      if (!response.ok) throw new Error();
      toast.success('Messages de la bannière enregistrés ✅');
    } catch (e) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSavingSections(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'arrivals') { loadArrivals(); return; }
    if (activeTab === 'promos') { fetchPromos(); return; }
    if (activeTab === 'depot-vente') { fetchDepotVente(); return; }
    fetchData();
    if (activeTab === 'customization') loadSectionsConfig();
  }, [activeTab]);

  const fetchData = async () => {
    if (activeTab === 'customization' || activeTab === 'arrivals' || activeTab === 'promos' || activeTab === 'depot-vente') return;
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

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSavingUser(true);
    try {
      const token = await getAdminToken();
      const payload: any = { name: editUserName };
      const balanceNum = parseFloat(editUserBalance);
      if (!isNaN(balanceNum) && balanceNum >= 0) {
        payload.balance = balanceNum;
      }
      payload.role = editUserRole;

      const res = await fetch(`${API_URL}/admin/users/${editingUser.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erreur lors de la mise à jour');
        return;
      }
      // Mise à jour locale immédiate
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === editingUser.userId
            ? { ...u, name: editUserName, balance: parseFloat(editUserBalance) || u.balance, role: editUserRole } as any
            : u
        )
      );
      toast.success('Utilisateur mis à jour ✅');
      setEditingUser(null);
    } catch (e) {
      toast.error('Erreur de communication avec le serveur');
    } finally {
      setIsSavingUser(false);
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

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white flex flex-col sticky top-0 h-screen shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className={`border-b border-white/10 flex items-center justify-between ${sidebarOpen ? 'p-8' : 'p-3'}`}>
          {sidebarOpen && <Logo light />}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all ml-auto shrink-0"
            title={sidebarOpen ? 'Réduire' : 'Développer'}
          >
            {sidebarOpen ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {[
            { id: 'requests', label: 'Demandes', icon: Inbox },
            { id: 'inventory', label: 'Inventaire', icon: Package },
            { id: 'arrivals', label: 'Arrivages', icon: Truck },
            { id: 'orders', label: 'Commandes', icon: LayoutDashboard },
            { id: 'users', label: 'Utilisateurs', icon: Users },
            { id: 'transactions', label: 'Transactions', icon: CreditCard },
            { id: 'promos', label: 'Codes Promo', icon: Percent },
            { id: 'depot-vente', label: 'Dépôt-Vente', icon: Smartphone },
            { id: 'customization', label: 'Personnalisation', icon: Tag },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              title={!sidebarOpen ? tab.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold transition-all ${
                sidebarOpen ? '' : 'justify-center'
              } ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={20} className="shrink-0" />
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          {sidebarOpen ? (
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Serveur Status</p>
              <div className="flex items-center gap-2 text-xs text-green-400 font-bold">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Opérationnel
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" title="Opérationnel" />
            </div>
          )}
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
              {activeTab === 'customization' && 'Personnalisation du Site'}
              {activeTab === 'arrivals' && 'Gestion des Arrivages'}
              {activeTab === 'promos' && 'Codes Promo'}
              {activeTab === 'depot-vente' && 'Dépôt-Vente'}
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
                              : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {order.status === 'paid' ? 'Payé'
                            : order.status === 'pending' ? 'Attente'
                            : order.status === 'shipped' ? '🚚 Expédié'
                            : order.status}
                        </span>
                        {order.trackingNumber && (
                          <p className="text-[10px] text-gray-400 mt-1">N° {order.trackingNumber}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {order.status === 'paid' && (
                            <button
                              onClick={() => { setShippingOrder(order); setTrackingNumber(''); setCarrier('Colissimo'); }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 text-white text-xs font-bold rounded-lg hover:bg-orange-700 transition-all"
                            >
                              <Truck size={14} />
                              Expédier
                            </button>
                          )}
                          {order.status === 'shipped' && (
                            <span className="flex items-center gap-1 text-blue-600 text-xs font-bold">
                              <PackageCheck size={14} />
                              Expédié
                            </span>
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
                          <button
                            onClick={() => {
                              setEditingUser(user);
                              setEditUserName(user.name || '');
                              setEditUserBalance((user.balance || 0).toFixed(2));
                              setEditUserRole((user as any).role || 'user');
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Modifier l'utilisateur"
                          >
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
          ) : activeTab === 'customization' ? (
            <div className="max-w-2xl space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <h2 className="text-lg font-black text-gray-900 mb-2">Bannière d'accueil</h2>
                <p className="text-sm text-gray-400 mb-6">Ces messages apparaissent sur la page d'accueil dans la section héro.</p>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Message principal (badge orange)</label>
                    <input
                      type="text"
                      value={sectionsConfig.bannerMessage1}
                      onChange={(e) => setSectionsConfig(prev => ({ ...prev, bannerMessage1: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                      placeholder="Ex: Derniers arrivages : +250 produits cette semaine"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Message secondaire (bulle flottante)</label>
                    <input
                      type="text"
                      value={sectionsConfig.bannerMessage2}
                      onChange={(e) => setSectionsConfig(prev => ({ ...prev, bannerMessage2: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                      placeholder="Ex: 120 MacBook Pro M3"
                    />
                  </div>
                  <button
                    onClick={saveSectionsConfig}
                    disabled={isSavingSections}
                    className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-700 transition-all disabled:opacity-50"
                  >
                    {isSavingSections ? 'Sauvegarde...' : 'Enregistrer les messages'}
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'promos' ? (
            <div className="max-w-3xl space-y-6">
              {/* Formulaire création */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h3 className="font-black text-gray-900 flex items-center gap-2">
                  <Percent size={18} className="text-orange-600" /> Créer un code promo
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Code *</label>
                    <input
                      type="text"
                      placeholder="BIENVENUE"
                      value={newPromo.code}
                      onChange={(e) => setNewPromo(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 font-mono tracking-widest uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Type de remise *</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setNewPromo(p => ({ ...p, type: 'fixed' }))}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                          newPromo.type === 'fixed' ? 'border-orange-600 bg-orange-50 text-orange-700' : 'border-gray-100 text-gray-500'
                        }`}
                      >
                        Montant fixe €
                      </button>
                      <button
                        onClick={() => setNewPromo(p => ({ ...p, type: 'percent' }))}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                          newPromo.type === 'percent' ? 'border-orange-600 bg-orange-50 text-orange-700' : 'border-gray-100 text-gray-500'
                        }`}
                      >
                        Pourcentage %
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                      {newPromo.type === 'fixed' ? 'Remise (€) *' : 'Remise (%) *'}
                    </label>
                    <input
                      type="number"
                      placeholder={newPromo.type === 'fixed' ? '5' : '10'}
                      value={newPromo.amount}
                      onChange={(e) => setNewPromo(p => ({ ...p, amount: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Commande min (€)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newPromo.min_order}
                      onChange={(e) => setNewPromo(p => ({ ...p, min_order: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Utilisations max</label>
                    <input
                      type="number"
                      placeholder="Illimité"
                      value={newPromo.max_uses}
                      onChange={(e) => setNewPromo(p => ({ ...p, max_uses: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Date d'expiration (optionnel)</label>
                  <input
                    type="date"
                    value={newPromo.expires_at}
                    onChange={(e) => setNewPromo(p => ({ ...p, expires_at: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <button
                  onClick={handleCreatePromo}
                  disabled={isCreatingPromo}
                  className="bg-orange-600 text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-orange-700 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Plus size={16} /> {isCreatingPromo ? 'Création...' : 'Créer le code'}
                </button>
              </div>

              {/* Liste des codes existants */}
              <div className="space-y-3">
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">
                  Codes actifs ({promos.length})
                </h3>
                {promos.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
                    Aucun code promo créé pour l'instant
                  </div>
                ) : (
                  promos.map((promo) => (
                    <div key={promo.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${promo.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-black text-gray-900 font-mono tracking-widest text-sm">{promo.code}</span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            promo.type === 'percent' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {promo.type === 'percent' ? `-${promo.amount}%` : `-${promo.amount}€`}
                          </span>
                          {promo.min_order > 0 && (
                            <span className="text-[10px] text-gray-400">min {promo.min_order}€</span>
                          )}
                          {promo.expires_at && (
                            <span className="text-[10px] text-gray-400">
                              expire le {new Date(promo.expires_at).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {promo.uses} utilisation{promo.uses !== 1 ? 's' : ''}
                          {promo.max_uses ? ` / ${promo.max_uses} max` : ' (illimité)'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => handleTogglePromo(promo.id, promo.is_active)}
                          className="transition-colors"
                          title={promo.is_active ? 'Désactiver' : 'Activer'}
                        >
                          {promo.is_active
                            ? <ToggleRight size={28} className="text-green-500 hover:text-gray-400" />
                            : <ToggleLeft size={28} className="text-gray-300 hover:text-green-500" />
                          }
                        </button>
                        <button
                          onClick={() => handleDeletePromo(promo.id, promo.code)}
                          className="p-2 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : activeTab === 'arrivals' ? (
            <div className="max-w-3xl space-y-6">
              {/* Info banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl px-6 py-4 flex items-start gap-3">
                <Truck size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Créez un lot d'arrivage et publiez-le pour mettre à jour automatiquement les messages de la bannière d'accueil.
                </p>
              </div>

              {/* Bouton nouveau lot */}
              {!showArrivalForm ? (
                <button
                  onClick={() => setShowArrivalForm(true)}
                  className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-700 transition-all"
                >
                  <Plus size={18} /> Nouveau lot d'arrivage
                </button>
              ) : (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <h3 className="font-black text-gray-900">Nouveau lot</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Nom du lot *</label>
                      <input
                        type="text"
                        placeholder="Ex: 50 MacBook Pro M3 Max"
                        value={newArrivalForm.name}
                        onChange={(e) => setNewArrivalForm(p => ({ ...p, name: e.target.value }))}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Nombre de produits</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Ex: 50"
                        value={newArrivalForm.productCount}
                        onChange={(e) => setNewArrivalForm(p => ({ ...p, productCount: e.target.value }))}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Description (optionnel)</label>
                      <input
                        type="text"
                        placeholder="Ex: Reconditionné grade A, garantie 12 mois"
                        value={newArrivalForm.description}
                        onChange={(e) => setNewArrivalForm(p => ({ ...p, description: e.target.value }))}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={createArrival}
                      disabled={isCreatingArrival}
                      className="bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-700 transition-all disabled:opacity-50"
                    >
                      {isCreatingArrival ? 'Création...' : 'Créer le lot'}
                    </button>
                    <button
                      onClick={() => { setShowArrivalForm(false); setNewArrivalForm({ name: '', description: '', productCount: '' }); }}
                      className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {/* Liste des lots */}
              {isArrivalsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
                </div>
              ) : arrivals.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Truck size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">Aucun lot créé pour l'instant</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {arrivals.map((lot) => (
                    <div
                      key={lot.id}
                      className={`bg-white rounded-3xl border shadow-sm p-6 flex items-center justify-between gap-4 ${lot.isActive ? 'border-orange-300 ring-2 ring-orange-500/20' : 'border-gray-100'}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${lot.isActive ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                          <Truck size={22} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-black text-gray-900">{lot.name}</h4>
                            {lot.isActive && (
                              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                                <BadgeCheck size={11} /> Actif
                              </span>
                            )}
                          </div>
                          {lot.description && <p className="text-xs text-gray-500 mb-1">{lot.description}</p>}
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="font-medium text-gray-600">{lot.productCount} produits</span>
                            <span>•</span>
                            <span>{new Date(lot.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            {lot.publishedAt && (
                              <>
                                <span>•</span>
                                <span>Publié le {new Date(lot.publishedAt).toLocaleDateString('fr-FR')}</span>
                              </>
                            )}
                          </div>
                          {lot.isActive && (
                            <div className="mt-2 text-[11px] text-orange-600 font-semibold bg-orange-50 inline-block px-2 py-0.5 rounded-lg">
                              Bannière → "Derniers arrivages : +{lot.productCount} produits cette semaine" · "{lot.name}"
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!lot.isActive && (
                          <button
                            onClick={() => publishArrival(lot.id)}
                            className="flex items-center gap-1.5 bg-orange-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-orange-700 transition-all"
                          >
                            <Send size={14} /> Publier
                          </button>
                        )}
                        <button
                          onClick={() => deleteArrival(lot.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'depot-vente' ? (
            <div className="max-w-4xl space-y-4">
              {isDepotVenteLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600" />
                </div>
              ) : depotVenteList.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
                  <Smartphone size={40} className="text-gray-200 mx-auto mb-4" />
                  <p className="font-bold text-gray-400">Aucune demande de dépôt-vente pour l'instant</p>
                  <p className="text-xs text-gray-400 mt-1">Les demandes soumises via la page "Vendre" apparaîtront ici.</p>
                </div>
              ) : (
                depotVenteList.map((s) => {
                  const statusColors: Record<string, string> = {
                    pending: 'bg-yellow-100 text-yellow-700',
                    contacted: 'bg-blue-100 text-blue-700',
                    accepted: 'bg-green-100 text-green-700',
                    rejected: 'bg-red-100 text-red-700',
                    sold: 'bg-purple-100 text-purple-700',
                  };
                  const statusLabels: Record<string, string> = {
                    pending: 'En attente',
                    contacted: 'Contacté',
                    accepted: 'Accepté',
                    rejected: 'Refusé',
                    sold: 'Vendu',
                  };
                  return (
                    <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                        <Smartphone size={22} className="text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="font-black text-gray-900">{s.brand} {s.model}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-200 text-gray-600 uppercase">{s.deviceType}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${statusColors[s.status] || 'bg-gray-100 text-gray-700'}`}>
                            {statusLabels[s.status] || s.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500 mb-2">
                          <span>État : <strong className="text-gray-700">{s.condition}</strong></span>
                          {s.askingPrice && <span>Prix souhaité : <strong className="text-gray-700">{s.askingPrice}€</strong></span>}
                          <span>{new Date(s.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        {s.description && <p className="text-xs text-gray-500 italic mb-2">"{s.description}"</p>}
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="font-bold">{s.name}</span>
                          <a href={`mailto:${s.email}`} className="text-orange-600 hover:underline flex items-center gap-1">
                            <Mail size={12} /> {s.email}
                          </a>
                          <a href={`tel:${s.phone}`} className="text-blue-600 hover:underline flex items-center gap-1">
                            <PhoneCall size={12} /> {s.phone}
                          </a>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <select
                          value={s.status}
                          onChange={(e) => handleDepotVenteStatus(s.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                          <option value="pending">En attente</option>
                          <option value="contacted">Contacté</option>
                          <option value="accepted">Accepté</option>
                          <option value="rejected">Refusé</option>
                          <option value="sold">Vendu</option>
                        </select>
                        <button
                          onClick={() => handleDepotVenteDelete(s.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all self-end"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
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
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Origine</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">État</th>
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
                          <td className="px-6 py-4">
                            {(item as any).tags?.[0] ? (
                              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase px-2 py-1 rounded-full">
                                {(item as any).tags[0]}
                              </span>
                            ) : (
                              <span className="text-gray-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-600 font-medium">
                            {item.condition || '—'}
                          </td>
                          <td className="px-6 py-4 font-black">
                            {(item.type === 'auction' ? item.currentBid || item.price : item.price)?.toLocaleString()}€
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setEditingProduct(item);
                                  setEditExistingImages(item.images && item.images.length > 0 ? item.images : (item.image_url || item.image ? [item.image_url || item.image] : []));
                                  setEditSelectedFiles([]);
                                }}
                                className="p-2 text-gray-400 hover:text-blue-600 transition-all"
                              >
                                <Edit3 size={18} />
                              </button>
                              <button
                                onClick={() => deleteProduct(item.id)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
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
              <h2 className="text-2xl font-black mb-6">Ajouter un produit</h2>
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
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Origine / Provenance</label>
                  <select
                    name="originTag"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
                  >
                    <option value="">— Aucune étiquette —</option>
                    <option value="Rachat particulier (HdF)">Rachat particulier (HdF)</option>
                    <option value="Rachat entreprise">Rachat entreprise</option>
                    <option value="Dépôt-vente particulier">Dépôt-vente particulier</option>
                    <option value="Stock neuf fournisseur">Stock neuf fournisseur</option>
                    <option value="Don / Association">Don / Association</option>
                    <option value="Import direct">Import direct</option>
                  </select>
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
        {editingProduct && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setEditingProduct(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button onClick={() => setEditingProduct(null)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black mb-1">Modifier le produit</h2>
              <p className="text-sm text-gray-400 mb-6">{editingProduct.title || editingProduct.name}</p>
              <form onSubmit={handleEditProduct} className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Nom du produit</label>
                  <input
                    name="name"
                    required
                    defaultValue={editingProduct.title || editingProduct.name || ''}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Prix de vente (€)</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    defaultValue={editingProduct.price || ''}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Prix barré (€)</label>
                  <input
                    name="originalPrice"
                    type="number"
                    step="0.01"
                    defaultValue={(editingProduct as any).original_price || (editingProduct as any).originalPrice || ''}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
                    placeholder="Optionnel"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Stock</label>
                  <input
                    name="stock"
                    type="number"
                    defaultValue={editingProduct.stock ?? 1}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Catégorie</label>
                  <select
                    name="category"
                    defaultValue={editingProduct.category || 'telephonie'}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
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
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">État</label>
                  <select
                    name="condition"
                    defaultValue={editingProduct.condition || 'Très bon état'}
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
                    defaultValue={editingProduct.description || ''}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none resize-none"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400">Photos du produit</label>
                  {/* Existing images */}
                  {editExistingImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editExistingImages.map((url, idx) => (
                        <div key={idx} className="relative group">
                          <img src={url} className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100" alt={`Photo ${idx + 1}`} />
                          {idx === 0 && (
                            <span className="absolute -top-1 -left-1 bg-orange-600 text-white text-[8px] font-black px-1 py-0.5 rounded-md">1ère</span>
                          )}
                          <button
                            type="button"
                            onClick={() => setEditExistingImages(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* New files preview */}
                  {editSelectedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editSelectedFiles.map((file, idx) => (
                        <div key={idx} className="relative group">
                          <img src={URL.createObjectURL(file)} className="w-16 h-16 rounded-xl object-cover border-2 border-blue-200" alt={`Nouveau ${idx + 1}`} />
                          <span className="absolute -top-1 -left-1 bg-blue-600 text-white text-[8px] font-black px-1 py-0.5 rounded-md">New</span>
                          <button
                            type="button"
                            onClick={() => setEditSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 hover:border-orange-400 transition-colors">
                    <span className="text-xs text-gray-500">+ Ajouter des photos (plusieurs possibles)</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setEditSelectedFiles(prev => [...prev, ...Array.from(e.target.files || [])])}
                    />
                  </label>
                  <p className="text-[10px] text-gray-400">Survole une photo et clique × pour la supprimer. La 1ère photo est l'image principale.</p>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Origine / Provenance</label>
                  <select
                    name="originTag"
                    defaultValue={(editingProduct as any).tags?.[0] || ''}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
                  >
                    <option value="">— Aucune étiquette —</option>
                    <option value="Rachat particulier (HdF)">Rachat particulier (HdF)</option>
                    <option value="Rachat entreprise">Rachat entreprise</option>
                    <option value="Dépôt-vente particulier">Dépôt-vente particulier</option>
                    <option value="Stock neuf fournisseur">Stock neuf fournisseur</option>
                    <option value="Don / Association">Don / Association</option>
                    <option value="Import direct">Import direct</option>
                  </select>
                </div>
                <div className="col-span-1 flex items-center gap-2">
                  <input type="checkbox" name="isNewArrival" id="edit-isNewArrival" defaultChecked={(editingProduct as any).is_new_arrival} />
                  <label htmlFor="edit-isNewArrival" className="text-sm font-medium">Nouvel arrivage</label>
                </div>
                <div className="col-span-1 flex items-center gap-2">
                  <input type="checkbox" name="isFeatured" id="edit-isFeatured" defaultChecked={(editingProduct as any).is_featured} />
                  <label htmlFor="edit-isFeatured" className="text-sm font-medium">Mis en avant</label>
                </div>
                <button
                  type="submit"
                  className="col-span-2 bg-orange-600 text-white py-4 rounded-xl font-bold mt-4 hover:bg-orange-700 transition-all"
                >
                  Enregistrer les modifications
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

      {/* ── Modal Édition Utilisateur ─────────────────────────────────────── */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !isSavingUser && setEditingUser(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl"
            >
              {/* Avatar + nom */}
              <div className="flex items-center gap-4 mb-8">
                <img
                  src={editingUser.avatar || `https://i.pravatar.cc/150?u=${editingUser.userId}`}
                  className="w-14 h-14 rounded-2xl object-cover"
                />
                <div>
                  <p className="font-black text-gray-900 text-lg">{editingUser.name}</p>
                  <p className="text-xs text-gray-400">{editingUser.email}</p>
                </div>
              </div>

              <form onSubmit={handleEditUser} className="space-y-5">
                {/* Nom */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Nom affiché
                  </label>
                  <input
                    value={editUserName}
                    onChange={(e) => setEditUserName(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>

                {/* Solde portefeuille */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1.5">
                    <Wallet size={12} /> Solde portefeuille (€)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editUserBalance}
                      onChange={(e) => setEditUserBalance(e.target.value)}
                      required
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">€</span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Solde actuel : <span className="font-bold text-orange-600">{(editingUser.balance || 0).toFixed(2)}€</span>
                  </p>
                </div>

                {/* Rôle */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1.5">
                    <ShieldCheck size={12} /> Rôle
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['user', 'admin'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setEditUserRole(r)}
                        className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                          editUserRole === r
                            ? r === 'admin'
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                        }`}
                      >
                        {r === 'admin' ? '🔐 Admin' : '👤 Utilisateur'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    disabled={isSavingUser}
                    className="flex-1 py-3 rounded-xl border-2 border-gray-100 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingUser}
                    className="flex-1 py-3 rounded-xl bg-orange-600 text-white font-bold text-sm hover:bg-orange-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSavingUser ? (
                      <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> Sauvegarde...</>
                    ) : (
                      'Enregistrer'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal Expédition ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {shippingOrder && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !isShipping && setShippingOrder(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl"
            >
              {/* Icône */}
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-6">
                <Truck size={32} className="text-orange-600" />
              </div>

              <h2 className="text-2xl font-black mb-1">Expédier la commande</h2>
              <p className="text-sm text-gray-500 mb-6">
                Commande <span className="font-mono font-bold text-gray-800">{shippingOrder.id}</span>
                {' '}— {(shippingOrder.total || shippingOrder.total_amount)?.toLocaleString()}€
              </p>

              {/* Articles */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-1">
                {(shippingOrder.items || shippingOrder.order_items || []).map((item: any, idx: number) => (
                  <p key={idx} className="text-xs text-gray-600">
                    • {item.name || item.product_title || item.title}
                    {item.quantity > 1 && <span className="text-gray-400"> ×{item.quantity}</span>}
                  </p>
                ))}
              </div>

              <div className="space-y-4">
                {/* Transporteur */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                    Transporteur
                  </label>
                  <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="Colissimo">Colissimo</option>
                    <option value="Mondial Relay">Mondial Relay</option>
                    <option value="Chronopost">Chronopost</option>
                    <option value="DHL">DHL</option>
                    <option value="UPS">UPS</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                {/* Numéro de suivi */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                    Numéro de suivi <span className="text-gray-300 font-normal">(optionnel)</span>
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="ex: 1Z999AA10123456784"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShippingOrder(null)}
                  disabled={isShipping}
                  className="flex-1 py-3.5 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleShipOrder}
                  disabled={isShipping}
                  className="flex-1 py-3.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isShipping ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Envoi…
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Envoyer la notification
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
