import React, { useState, useRef, useEffect } from 'react';
import {
  Package,
  Settings,
  LogOut,
  CheckCircle2,
  User,
  Camera,
  MapPin,
  Download,
  RefreshCcw,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import { CollaborativeSellingDashboard } from './CollaborativeSellingDashboard';
import { projectId, publicAnonKey } from 'utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e62e42f7`;

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  label: string;
  date: string;
  status: 'Complété' | 'En attente';
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Expédié' | 'En préparation' | 'Livré';
  items: string[];
  image: string;
}

interface Address {
  id: string;
  label: string;
  fullName: string;
  street: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
}

type ActiveTab = 'orders' | 'settings' | 'selling';

export const UserProfile = ({
  user,
  profile,
  onLogout,
  onUpdateProfile,
  onNavigate,
}: {
  user: any;
  profile: any;
  onLogout: () => void;
  onUpdateProfile: (updates: any) => void;
  onNavigate: (page: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('orders');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    name: '',
    email: '',
    phone: '',
    street: '',
    zipCode: '',
    city: '',
    country: 'France',
  });

  useEffect(() => {
    setEditForm({
      firstName: profile?.firstName || user?.user_metadata?.firstName || '',
      lastName: profile?.lastName || user?.user_metadata?.lastName || '',
      name: profile?.name || user?.user_metadata?.name || '',
      email: profile?.email || user?.email || '',
      phone: profile?.phone || '',
      street: profile?.street || '',
      zipCode: profile?.zipCode || '',
      city: profile?.city || '',
      country: profile?.country || 'France',
    });
  }, [profile, user]);

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user?.id) return;

    if (activeTab === 'orders') {
      fetchOrders();
    }

    if (activeTab === 'settings') {
      fetchTransactions();
    }
  }, [activeTab, user?.id]);

  const fetchTransactions = async () => {
    try {
      setIsLoadingTransactions(true);
      const response = await fetch(`${API_URL}/transactions?userId=${user.id}`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const response = await fetch(`${API_URL}/orders?userId=${user.id}`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUserOrders(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleDownloadInvoice = (transaction: Transaction) => {
    const doc = new jsPDF();

    doc.setFillColor(234, 88, 12);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('SUPERMALIN', 20, 25);

    doc.setFontSize(10);
    doc.text('Facture Provisoire', 160, 25);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.text(`Client: ${profile?.name || user?.user_metadata?.name || 'Client SuperMalin'}`, 20, 60);
    doc.text(`Email: ${user?.email || ''}`, 20, 67);
    doc.text(`Date: ${new Date(transaction.date).toLocaleDateString('fr-FR')}`, 20, 74);
    doc.text(`Facture N°: ${transaction.id}`, 20, 81);

    doc.setFillColor(245, 245, 245);
    doc.rect(20, 100, 170, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 25, 107);
    doc.text('Montant', 160, 107);

    doc.setFont('helvetica', 'normal');
    doc.text(transaction.label, 25, 120);
    doc.text(`${transaction.amount.toFixed(2)}€`, 160, 120);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 130, 190, 130);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL TTC', 130, 140);
    doc.text(`${transaction.amount.toFixed(2)}€`, 160, 140);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('SuperMalin SAS - SIRET: 92822322100013', 105, 275, { align: 'center' });
    doc.text('Hauts-de-France, France', 105, 280, { align: 'center' });
    doc.text('Email: contact@supermalin.fr - Tél: 0977454776', 105, 285, { align: 'center' });
    doc.text('Merci pour votre confiance !', 105, 290, { align: 'center' });

    doc.save(`Facture-SuperMalin-${transaction.id}.pdf`);
    toast.success('Facture téléchargée !');
  };

  const handleDownloadOrderInvoice = (order: any) => {
    const doc = new jsPDF();

    doc.setFillColor(234, 88, 12);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('SUPERMALIN', 20, 25);
    doc.setFontSize(10);
    doc.text('Facture', 170, 25);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.text(`Client: ${profile?.name || user?.user_metadata?.name || 'Client SuperMalin'}`, 20, 60);
    doc.text(`Email: ${user?.email || ''}`, 20, 67);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR')}`, 20, 74);
    doc.text(`Commande N°: ${order.id}`, 20, 81);

    doc.setFillColor(245, 245, 245);
    doc.rect(20, 100, 170, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Article', 25, 107);
    doc.text('Montant', 160, 107);

    doc.setFont('helvetica', 'normal');
    let y = 120;
    (order.items || []).forEach((item: any) => {
      doc.text(String(item.name || item.title || 'Produit').substring(0, 60), 25, y);
      doc.text(`${Number(item.price || 0).toFixed(2)}€`, 160, y);
      y += 10;
    });

    doc.setDrawColor(200, 200, 200);
    doc.line(20, y + 5, 190, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL TTC', 130, y + 15);
    doc.text(`${Number(order.total || 0).toFixed(2)}€`, 160, y + 15);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('SuperMalin SAS - SIRET: 92822322100013', 105, 275, { align: 'center' });
    doc.text('Hauts-de-France, France', 105, 280, { align: 'center' });
    doc.text('Email: contact@supermalin.fr - Tél: 0977454776', 105, 285, { align: 'center' });
    doc.text('Merci pour votre confiance !', 105, 290, { align: 'center' });

    doc.save(`Facture-SuperMalin-${order.id}.pdf`);
    toast.success('Facture téléchargée !');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/profile/${user.id}/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onUpdateProfile({ avatar: data.avatar });
        toast.success('Photo de profil mise à jour !');
      } else {
        toast.error("Erreur lors de l'envoi");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'envoi");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState<Partial<Address>>({
    label: '',
    fullName: '',
    street: '',
    city: '',
    zipCode: '',
  });

  const handleAddAddress = () => {
    const newAddress: Address = {
      id: Math.random().toString(36).slice(2, 11),
      label: addressForm.label || 'Maison',
      fullName: addressForm.fullName || '',
      street: addressForm.street || '',
      city: addressForm.city || '',
      zipCode: addressForm.zipCode || '',
      isDefault: (profile?.addresses?.length || 0) === 0,
    };

    const updatedAddresses = [...(profile?.addresses || []), newAddress];
    onUpdateProfile({ addresses: updatedAddresses });

    setIsAddingAddress(false);
    setAddressForm({
      label: '',
      fullName: '',
      street: '',
      city: '',
      zipCode: '',
    });

    toast.success('Adresse ajoutée !');
  };

  const handleSaveProfile = () => {
    onUpdateProfile(editForm);
    setIsEditing(false);
    toast.success('Informations mises à jour !');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm sticky top-24">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-4 border-4 border-orange-50 overflow-hidden">
                  {isUploadingAvatar ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-600 border-t-transparent" />
                  ) : profile?.avatar ? (
                    <ImageWithFallback
                      src={profile.avatar}
                      alt={profile?.name || user?.user_metadata?.name || 'Avatar'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-3xl font-black">
                      {(profile?.firstName?.[0] || profile?.name?.[0] || user?.user_metadata?.name?.[0] || 'U').toUpperCase()}
                      {(profile?.lastName?.[0] || profile?.name?.split(' ')[1]?.[0] || '').toUpperCase()}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAvatarClick}
                  className="absolute bottom-4 right-0 p-2 bg-orange-600 text-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform duration-200"
                  title="Changer la photo"
                >
                  <Camera size={14} />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                {profile?.name || user?.user_metadata?.name || 'Utilisateur'}
              </h2>

              <p className="text-sm text-gray-500">
                Membre depuis{' '}
                {new Date(profile?.createdAt || user?.created_at).toLocaleDateString('fr-FR', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>

              {user?.email_confirmed_at && (
                <div className="mt-2 flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase">
                  <CheckCircle2 size={12} /> Compte Vérifié
                </div>
              )}
            </div>

            <nav className="space-y-1">
              {[
                { id: 'orders', label: 'Mes Commandes', icon: Package },
                { id: 'settings', label: 'Paramètres', icon: Settings },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === item.id
                      ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/10'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.label}
                  </div>
                </button>
              ))}

              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all mt-4"
              >
                <LogOut size={18} /> Déconnexion
              </button>
            </nav>
          </div>
        </div>

        <div className="lg:w-3/4">
          {activeTab === 'selling' && <CollaborativeSellingDashboard />}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-gray-900">Historique de commandes</h1>
                <button onClick={fetchOrders} className="p-2 text-gray-400 hover:text-orange-600">
                  <RefreshCcw size={16} className={isLoadingOrders ? 'animate-spin' : ''} />
                </button>
              </div>

              {isLoadingOrders ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
                </div>
              ) : userOrders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
                  <Package size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-500 font-medium">Vous n'avez pas encore passé de commande.</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="mt-4 text-orange-600 font-bold hover:underline"
                  >
                    Découvrir la boutique
                  </button>
                </div>
              ) : (
                userOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 text-gray-400">
                          <Package size={32} />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase text-gray-400">
                              Commande {order.id}
                            </span>
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
                                ? 'En attente'
                                : order.status}
                            </span>
                          </div>

                          <h3 className="font-bold text-gray-900 mb-1">
                            {order.items?.length || 0} article(s) • {order.items?.[0]?.name || 'Produit'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className="text-xl font-black text-gray-900">
                          {Number(order.total || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
                        </div>
                        <button
                          onClick={() => handleDownloadOrderInvoice(order)}
                          className="text-[10px] font-bold text-blue-600 uppercase mt-2 flex items-center gap-1 hover:text-blue-800 transition-colors"
                        >
                          <Download size={12} /> Facture
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              <h1 className="text-2xl font-black text-gray-900">Paramètres du compte</h1>

              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <User size={20} className="text-orange-600" /> Informations Personnelles
                  </h3>

                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs font-black uppercase text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg"
                    >
                      Modifier
                    </button>
                  )}
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-400">Prénom</label>
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        disabled={!isEditing}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none transition-all disabled:opacity-70"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-400">Nom</label>
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        disabled={!isEditing}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none transition-all disabled:opacity-70"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-400">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        disabled
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm opacity-70"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-400">Téléphone</label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Ex: 06 12 34 56 78"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none transition-all disabled:opacity-70"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin size={16} className="text-orange-600" /> Adresse complète
                    </h4>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-400">Rue</label>
                        <input
                          type="text"
                          value={editForm.street}
                          onChange={(e) => setEditForm({ ...editForm, street: e.target.value })}
                          disabled={!isEditing}
                          placeholder="Ex: 123 Rue de la République"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none transition-all disabled:opacity-70"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-gray-400">Code Postal</label>
                          <input
                            type="text"
                            value={editForm.zipCode}
                            onChange={(e) => setEditForm({ ...editForm, zipCode: e.target.value })}
                            disabled={!isEditing}
                            placeholder="Ex: 59000"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none transition-all disabled:opacity-70"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-gray-400">Ville</label>
                          <input
                            type="text"
                            value={editForm.city}
                            onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                            disabled={!isEditing}
                            placeholder="Ex: Lille"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none transition-all disabled:opacity-70"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-gray-400">Pays</label>
                          <input
                            type="text"
                            value={editForm.country}
                            onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                            disabled={!isEditing}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none transition-all disabled:opacity-70"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
                      >
                        Enregistrer
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({
                            firstName: profile?.firstName || user?.user_metadata?.firstName || '',
                            lastName: profile?.lastName || user?.user_metadata?.lastName || '',
                            name: profile?.name || user?.user_metadata?.name || '',
                            email: profile?.email || user?.email || '',
                            phone: profile?.phone || '',
                            street: profile?.street || '',
                            zipCode: profile?.zipCode || '',
                            city: profile?.city || '',
                            country: profile?.country || 'France',
                          });
                        }}
                        className="text-gray-500 font-bold text-sm hover:text-gray-700"
                      >
                        Annuler
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};