import { useState } from "react";
import { motion } from "motion/react";
import {
  Smartphone, Laptop, Tablet, Gamepad2, Tv, Package,
  CheckCircle, Euro, Shield, Clock, ArrowRight, ChevronDown
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e62e42f7`;

const DEVICE_TYPES = [
  { id: "smartphone", label: "Smartphone", icon: Smartphone },
  { id: "laptop", label: "MacBook / PC", icon: Laptop },
  { id: "tablette", label: "Tablette", icon: Tablet },
  { id: "console", label: "Console", icon: Gamepad2 },
  { id: "tv", label: "TV / Écran", icon: Tv },
  { id: "autre", label: "Autre", icon: Package },
];

const CONDITIONS = [
  { id: "Neuf", label: "Neuf / Jamais utilisé", color: "bg-green-50 border-green-300 text-green-800" },
  { id: "Très bon état", label: "Très bon état", color: "bg-blue-50 border-blue-300 text-blue-800" },
  { id: "Bon état", label: "Bon état", color: "bg-indigo-50 border-indigo-300 text-indigo-800" },
  { id: "Correct", label: "État correct", color: "bg-yellow-50 border-yellow-300 text-yellow-800" },
  { id: "Pour pièces", label: "Pour pièces / HS", color: "bg-red-50 border-red-300 text-red-800" },
];

export const DepotVentePage = () => {
  const [step, setStep] = useState<"form" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    deviceType: "",
    brand: "",
    model: "",
    condition: "",
    askingPrice: "",
    description: "",
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.deviceType) newErrors.deviceType = "Sélectionnez un type d'appareil";
    if (!formData.brand.trim()) newErrors.brand = "La marque est requise";
    if (!formData.model.trim()) newErrors.model = "Le modèle est requis";
    if (!formData.condition) newErrors.condition = "Sélectionnez l'état de l'appareil";
    if (!formData.name.trim()) newErrors.name = "Votre nom est requis";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email invalide";
    if (!formData.phone.trim()) newErrors.phone = "Votre téléphone est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/depot-vente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      setStep("success");
    } catch {
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Demande envoyée !</h2>
          <p className="text-gray-500 mb-6">
            Nous avons bien reçu votre demande concernant votre{" "}
            <strong>{formData.brand} {formData.model}</strong>. Nous vous contactons sous 24h.
          </p>
          <button
            onClick={() => { setStep("form"); setFormData({ deviceType:"", brand:"", model:"", condition:"", askingPrice:"", description:"", name:"", email:"", phone:"" }); }}
            className="text-orange-600 font-bold text-sm hover:underline"
          >
            Soumettre un autre appareil
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gray-900 text-white py-14 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-orange-600/15 border border-orange-500/25 text-orange-400 px-4 py-1.5 rounded-full text-sm font-bold mb-5"
          >
            <Euro size={14} />
            <span>Vendez vos appareils sans effort</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold mb-4"
          >
            Confiez-nous votre appareil,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              on s'occupe de tout
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base md:text-lg max-w-xl mx-auto"
          >
            Vous nous confiez votre appareil, on le vend sur notre boutique. Vous touchez votre prix, sans frais, sans stress.
          </motion.p>

          {/* Avantages */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-4 mt-10 max-w-xl mx-auto"
          >
            {[
              { icon: Shield, label: "Sécurisé", sub: "Appareil assuré" },
              { icon: Clock, label: "Rapide", sub: "Sous 24h" },
              { icon: Euro, label: "Sans frais", sub: "0% de commission cachée" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1.5">
                <item.icon size={20} className="text-orange-400" />
                <p className="text-white font-bold text-sm">{item.label}</p>
                <p className="text-gray-500 text-xs">{item.sub}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Type d'appareil */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-900 mb-4">
              1. Quel type d'appareil ?
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {DEVICE_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, deviceType: type.id }))}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all font-bold text-sm ${
                    formData.deviceType === type.id
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-100 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <type.icon size={22} />
                  {type.label}
                </button>
              ))}
            </div>
            {errors.deviceType && <p className="text-red-500 text-xs mt-2">{errors.deviceType}</p>}
          </div>

          {/* Détails de l'appareil */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-900 mb-4">2. Détails de l'appareil</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Marque *
                  </label>
                  <input
                    type="text"
                    placeholder="Apple, Samsung, Sony…"
                    value={formData.brand}
                    onChange={(e) => setFormData((p) => ({ ...p, brand: e.target.value }))}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                      errors.brand ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Modèle *
                  </label>
                  <input
                    type="text"
                    placeholder="iPhone 14, MacBook Pro M2…"
                    value={formData.model}
                    onChange={(e) => setFormData((p) => ({ ...p, model: e.target.value }))}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                      errors.model ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
                </div>
              </div>

              {/* État */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  État *
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {CONDITIONS.map((c) => (
                    <label
                      key={c.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.condition === c.id
                          ? c.color + " border-current"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="condition"
                        value={c.id}
                        checked={formData.condition === c.id}
                        onChange={() => setFormData((p) => ({ ...p, condition: c.id }))}
                        className="accent-orange-600"
                      />
                      <span className="text-sm font-semibold">{c.label}</span>
                    </label>
                  ))}
                </div>
                {errors.condition && <p className="text-red-500 text-xs mt-1">{errors.condition}</p>}
              </div>

              {/* Prix souhaité */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Prix souhaité (€) — optionnel
                </label>
                <div className="relative">
                  <Euro size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Ex: 250"
                    min="0"
                    value={formData.askingPrice}
                    onChange={(e) => setFormData((p) => ({ ...p, askingPrice: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  Laissez vide si vous ne savez pas, on vous propose une estimation.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Description / infos complémentaires
                </label>
                <textarea
                  rows={3}
                  placeholder="Capacité de stockage, accessoires inclus, défauts éventuels…"
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-900 mb-4">3. Vos coordonnées</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Nom complet *
                </label>
                <input
                  type="text"
                  placeholder="Jean Dupont"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                    errors.name ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="jean@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                      errors.email ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    placeholder="06 12 34 56 78"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                      errors.phone ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-black text-base py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-900/20"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Envoi en cours…
              </>
            ) : (
              <>
                Envoyer ma demande
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            En soumettant ce formulaire, vous acceptez qu'on vous recontacte pour discuter de votre appareil.
          </p>
        </form>
      </div>
    </div>
  );
};
