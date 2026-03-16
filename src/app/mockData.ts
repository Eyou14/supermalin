import { Product } from "./components/ProductCard";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max 256GB - Titane Naturel',
    category: 'telephonie',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600',
    price: 980,
    originalPrice: 1249,
    condition: 'Neuf',
    type: 'direct',
    stock: 2,
    tested: true
  },
  {
    id: '2',
    name: 'MacBook Air M2 13" 8GB/256GB - Minuit',
    category: 'informatique',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=600',
    price: 890,
    originalPrice: 1199,
    condition: 'Comme neuf',
    type: 'direct',
    stock: 3,
    tested: true
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5 Casque à Réduction de Bruit',
    category: 'audio-video',
    image: 'https://images.unsplash.com/photo-1675662700508-3f538740c548?q=80&w=600',
    price: 210,
    originalPrice: 299,
    condition: 'Très bon état',
    type: 'direct',
    stock: 5,
    tested: true
  },
  {
    id: '4',
    name: 'iPad Pro 11" M2 (4ème gén) 128GB WiFi',
    category: 'informatique',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600',
    price: 720,
    originalPrice: 949,
    condition: 'Neuf',
    type: 'direct',
    stock: 4,
    tested: true
  },
  {
    id: '5',
    name: 'Lot de 10 Chargeurs MagSafe Apple (Bulk)',
    category: 'accessoires',
    image: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=600',
    price: 150,
    originalPrice: 450,
    condition: 'Neuf ouvert',
    type: 'direct',
    stock: 12,
    tested: true
  },
  {
    id: '6',
    name: 'PlayStation 5 avec Lecteur - Pack 2 Manettes',
    category: 'gaming',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600',
    price: 320,
    condition: 'Correct',
    type: 'auction',
    auctionEnd: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
    currentBid: 320,
    bidCount: 24,
    tested: true
  },
  {
    id: '7',
    name: 'Apple Watch Series 9 45mm GPS - Minuit',
    category: 'objets-connectes',
    image: 'https://images.unsplash.com/photo-1434493907317-a46b53b81882?q=80&w=600',
    price: 290,
    originalPrice: 449,
    condition: 'Très bon état',
    type: 'direct',
    stock: 1,
    tested: true
  },
  {
    id: '9',
    name: 'Veste en Cuir Vintage - Taille L',
    category: 'vetements',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600',
    price: 85,
    originalPrice: 220,
    condition: 'Très bon état',
    type: 'direct',
    stock: 3,
    tested: false
  },
  {
    id: '10',
    name: 'Lot de 5 T-shirts Coton Bio - Blanc',
    category: 'vetements',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600',
    price: 35,
    condition: 'Neuf scellé',
    type: 'auction',
    auctionEnd: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
    currentBid: 12,
    bidCount: 4,
    tested: false
  },
  {
    id: '11',
    name: 'Machine à Café Espresso Automatique',
    category: 'maison',
    image: 'https://images.unsplash.com/photo-1510511459019-5dee9954889c?q=80&w=600',
    price: 145,
    originalPrice: 349,
    condition: 'Bon état',
    type: 'direct',
    stock: 2,
    tested: true
  },
  {
    id: '12',
    name: 'Canapé Scandinave 3 Places - Gris Anthracite',
    category: 'maison',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600',
    price: 250,
    condition: 'Très bon état',
    type: 'auction',
    auctionEnd: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    currentBid: 210,
    bidCount: 15,
    tested: false
  }
];