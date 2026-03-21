import type { Product, Section, BannerConfig, ContactConfig } from '../../core/types/catalog';

// --- INITIAL MOCK DATA ---
const INITIAL_SECTIONS: Section[] = [
  { id: 'sec-1', name: 'Tartas Clásicas', slug: 'tartas-clasicas', order: 1, isActive: true },
  { id: 'sec-2', name: 'Postres de Autor', slug: 'postres-de-autor', order: 2, isActive: true },
  { id: 'sec-3', name: 'Bocados Pequeños', slug: 'bocados', order: 3, isActive: true },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sectionId: 'sec-1',
    name: 'Tarta de Frutillas',
    description: 'Masa sablée con abundante crema pastelera y frutillas frescas fileteadas.',
    price: 8500,
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    sectionId: 'sec-1',
    name: 'Lemon Pie',
    description: 'Suave crema de limón sobre base crocante, coronada con merengue italiano.',
    price: 7900,
    imageUrl: 'https://images.unsplash.com/photo-1519915028121-7d3463d20a1b?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    sectionId: 'sec-2',
    name: 'Marquise de Chocolate',
    description: 'Intensa torta húmeda de chocolate amargo, servida con frutos rojos.',
    price: 9200,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
    options: [
      { id: 'opt-1', name: 'Extra Coulis de Frutos Rojos', priceOffset: 800 },
      { id: 'opt-2', name: 'Bocha de Helado (Aparte)', priceOffset: 1500 }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    sectionId: 'sec-3',
    name: 'Macarons Surtidos (x6)',
    description: 'Caja premium con 6 macarons de sabores surtidos (pistacho, frambuesa, chocolate, limón).',
    price: 6500,
    imageUrl: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  }
];

let MOCK_BANNER: BannerConfig = {
  id: 'banner-1',
  title: 'Sabor con intención. Diseño con alma.',
  subtitle: 'No es solo pastelería; es el arte de transformar tu mesa en una celebración inolvidable.',
  imageUrl: '/TiniMigliore1.png',
  callToActionText: 'Ver Colección',
  callToActionUrl: '/#seccion-postres-de-autor',
  showTitle: true,
  showSubtitle: true,
  showCta: true,
  isActive: true
};

let MOCK_CONTACT: ContactConfig = {
  id: 'contact-1',
  text: 'Contactanos de Martes a Domingos para hacer tu pedido especial, conocer nuestro catálogo completo o consultarnos sobre nuestras opciones para eventos. Tu momento dulce merece una obra de arte y estamos acá para hacerlo posible. ¡Reservá con al menos 48hs de anticipación!',
  imageUrl: 'https://images.unsplash.com/photo-1557925923-33b251d5928f?auto=format&fit=crop&q=80&w=800',
  isActive: true
};

// --- LOCAL STORAGE HELPERS ---
const STORAGE_KEYS = {
  SECTIONS: 'tini_sections',
  PRODUCTS: 'tini_products',
  BANNER: 'tini_banner',
  CONTACT: 'tini_contact',
};

// Initialize data from localStorage or fallback to constants
const getStoredSections = (): Section[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.SECTIONS);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(INITIAL_SECTIONS));
  return INITIAL_SECTIONS;
};

const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
};

const saveSections = (sections: Section[]) => {
  localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
};

const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

const getStoredBanner = (): BannerConfig => {
  const stored = localStorage.getItem(STORAGE_KEYS.BANNER);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEYS.BANNER, JSON.stringify(MOCK_BANNER));
  return MOCK_BANNER;
};

const getStoredContact = (): ContactConfig => {
  const stored = localStorage.getItem(STORAGE_KEYS.CONTACT);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify(MOCK_CONTACT));
  return MOCK_CONTACT;
};

const saveBanner = (banner: BannerConfig) => {
  localStorage.setItem(STORAGE_KEYS.BANNER, JSON.stringify(banner));
};

const saveContact = (contact: ContactConfig) => {
  localStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify(contact));
};

// State holding the current data
let currentSections = getStoredSections();
let currentProducts = getStoredProducts();
let currentBanner = getStoredBanner();
let currentContact = getStoredContact();

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate basic unique IDs
const generateId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;


// --- CATALOG SERVICE (MOCK WITH LOCALSTORAGE) ---
export const catalogService = {

  // -- SECTIONS --

  getSections: async (): Promise<Section[]> => {
    await delay(300);
    // Sort sections so they appear in correct order
    return [...currentSections].sort((a, b) => a.order - b.order);
  },

  createSection: async (data: Omit<Section, 'id'>): Promise<Section> => {
    await delay(400);
    const newSection: Section = { ...data, id: generateId('sec') };
    currentSections = [...currentSections, newSection];
    saveSections(currentSections);
    return newSection;
  },

  updateSection: async (id: string, data: Partial<Section>): Promise<Section> => {
    await delay(400);
    const index = currentSections.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Sección no encontrada');

    currentSections[index] = { ...currentSections[index], ...data };
    saveSections(currentSections);
    return currentSections[index];
  },

  deleteSection: async (id: string): Promise<void> => {
    await delay(400);
    currentSections = currentSections.filter(s => s.id !== id);
    saveSections(currentSections);

    // Also remove products from this section to keep data consistent (Optional but recommended)
    currentProducts = currentProducts.filter(p => p.sectionId !== id);
    saveProducts(currentProducts);
  },

  // -- PRODUCTS --

  getProducts: async (sectionId?: string): Promise<Product[]> => {
    await delay(400);
    let products = [...currentProducts];

    if (sectionId) {
      products = products.filter(p => p.sectionId === sectionId);
    }

    // Sort products logically, e.g., newest first
    return products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    await delay(300);
    return currentProducts.find(p => p.id === id);
  },

  createProduct: async (data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    await delay(500);
    const newProduct: Product = {
      ...data,
      id: generateId('prod'),
      createdAt: new Date().toISOString()
    };
    currentProducts = [...currentProducts, newProduct];
    saveProducts(currentProducts);
    return newProduct;
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    await delay(500);
    const index = currentProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Producto no encontrado');

    currentProducts[index] = { ...currentProducts[index], ...data };
    saveProducts(currentProducts);
    return currentProducts[index];
  },

  deleteProduct: async (id: string): Promise<void> => {
    await delay(500);
    currentProducts = currentProducts.filter(p => p.id !== id);
    saveProducts(currentProducts);
  },

  // -- BANNER & CONTACT --

  getBanner: async (): Promise<BannerConfig> => {
    await delay(300);
    return currentBanner;
  },

  updateBanner: async (data: Partial<BannerConfig>): Promise<BannerConfig> => {
    await delay(400);
    currentBanner = { ...currentBanner, ...data };
    saveBanner(currentBanner);
    return currentBanner;
  },

  getContact: async (): Promise<ContactConfig> => {
    await delay(300);
    return currentContact;
  },

  updateContact: async (data: Partial<ContactConfig>): Promise<ContactConfig> => {
    await delay(400);
    currentContact = { ...currentContact, ...data };
    saveContact(currentContact);
    return currentContact;
  }
};