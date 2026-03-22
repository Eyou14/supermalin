import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e62e42f7`;

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Message envoyé avec succès ! Nous vous répondrons sous 24h.");
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Erreur serveur');
      }
    } catch (error: any) {
      // Fallback : copier l'email de contact si l'API échoue
      toast.error("Envoi échoué. Contactez-nous directement à contact@supermalin.fr");
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4">Contactez-nous</h1>
          <p className="text-gray-600 text-lg">
            Une question ? Un problème ? Notre équipe est là pour vous aider !
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-8">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <MessageSquare className="text-orange-600" />
              Envoyez-nous un message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600 transition-colors"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600 transition-colors"
                  placeholder="votre@email.fr"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-bold mb-2">
                  Sujet *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600 transition-colors"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="order">Commande et suivi</option>
                  <option value="product">Produit et stock</option>
                  <option value="return">Retour et remboursement</option>
                  <option value="payment">Paiement et facturation</option>
                  <option value="technical">Problème technique</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-600 transition-colors resize-none"
                  placeholder="Décrivez votre demande en détail..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-600 text-white py-4 rounded-xl font-black hover:bg-orange-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Send size={20} />
                    Envoyer le message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Email */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-3xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Email</h3>
                  <p className="text-gray-700 mb-2">
                    Contactez-nous par email, nous vous répondrons sous 24h
                  </p>
                  <a
                    href="mailto:contact@supermalin.fr"
                    className="text-orange-600 font-bold hover:underline"
                  >
                    contact@supermalin.fr
                  </a>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-3xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Téléphone</h3>
                  <p className="text-gray-700 mb-2">
                    Du lundi au vendredi, 9h-18h
                  </p>
                  <a
                    href="tel:0977454776"
                    className="text-blue-600 font-bold hover:underline"
                  >
                    0977454776
                  </a>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-3xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-gray-900 text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Adresse</h3>
                  <p className="text-gray-700">
                    SUPER MALIN SAS<br />
                    SIRET: 92822322100013<br />
                    Hauts-de-France<br />
                    France
                  </p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-3">Horaires</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lundi - Vendredi</span>
                      <span className="font-bold">9h00 - 18h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Samedi</span>
                      <span className="font-bold">10h00 - 16h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dimanche</span>
                      <span className="font-bold text-red-500">Fermé</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-3xl p-6">
              <h3 className="font-bold text-lg mb-2">Questions fréquentes</h3>
              <p className="text-gray-700 mb-4">
                Consultez notre FAQ pour trouver rapidement des réponses aux questions les plus courantes.
              </p>
              <a
                href="/cgv"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-all"
              >
                Voir la FAQ
              </a>
            </div>
          </div>
        </div>

        {/* Chat Widget Notice */}
        <div className="mt-12 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-black mb-3">Besoin d'une réponse immédiate ?</h3>
          <p className="mb-4">
            Utilisez notre chat en ligne pour parler directement avec un conseiller !
          </p>
          <p className="text-sm opacity-90">
            💬 Le chat est disponible en bas à droite de votre écran
          </p>
        </div>
      </div>
    </div>
  );
};