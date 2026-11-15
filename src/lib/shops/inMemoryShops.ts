export interface InMemoryShop {
  _id: string;
  ownerId: string;
  ownerEmail: string;
  ownerName: string;
  ownerPhone: string;
  shopName: string;
  slug: string;
  description: string;
  category: string;
  city: string;
  address?: string;
  logoUrl?: string;
  bannerUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  rating: number;
  totalProducts: number;
  createdAt: string;
  updatedAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var globalShopRegistry: Map<string, InMemoryShop> | undefined;
}

// Initial seed shops (Pre-approved verified stores)
const initialSeedShops: InMemoryShop[] = [
  {
    _id: 'shop_ceylon_spices_01',
    ownerId: 'usr_vendor_01',
    ownerEmail: 'spices@ceylonheritage.lk',
    ownerName: 'Sunil Perera',
    ownerPhone: '+94 77 123 4567',
    shopName: 'Ceylon Royal Spices & Herbs',
    slug: 'ceylon-royal-spices',
    description: 'Direct-from-farm organic Ceylon cinnamon, black pepper, cardamoms, and traditional ayurvedic herbs.',
    category: 'Ceylon Spices',
    city: 'Kandy',
    address: 'No 45, Temple Road, Kandy',
    logoUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
    status: 'APPROVED',
    rating: 4.9,
    totalProducts: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'shop_lanka_organics_02',
    ownerId: 'usr_vendor_02',
    ownerEmail: 'organics@lankamart.lk',
    ownerName: 'Fathima Rizwan',
    ownerPhone: '+94 71 987 6543',
    shopName: 'Lanka Pure Organics & Groceries',
    slug: 'lanka-pure-organics',
    description: 'Certified organic grains, heirloom red rice, natural virgin coconut oil, and sun-dried pulses.',
    category: 'Groceries & Organics',
    city: 'Colombo',
    address: '12 Galle Road, Colombo 03',
    logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    status: 'APPROVED',
    rating: 4.8,
    totalProducts: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'shop_jaffna_crafts_03',
    ownerId: 'usr_vendor_03',
    ownerEmail: 'palmyrah@jaffnahandicrafts.lk',
    ownerName: 'Kandeepan Sivam',
    ownerPhone: '+94 76 555 4321',
    shopName: 'Jaffna Heritage Crafts & Palmyrah',
    slug: 'jaffna-heritage-crafts',
    description: 'Authentic Jaffna palmyrah baskets, eco-friendly homeware, natural jaggery, and brass utensils.',
    category: 'Handicrafts & Decor',
    city: 'Jaffna',
    address: '88 Hospital Road, Jaffna',
    logoUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1200&q=80',
    status: 'APPROVED',
    rating: 5.0,
    totalProducts: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const shopRegistry = global.globalShopRegistry || new Map<string, InMemoryShop>();
if (!global.globalShopRegistry) {
  initialSeedShops.forEach((shop) => shopRegistry.set(shop.slug, shop));
  global.globalShopRegistry = shopRegistry;
}

export function getAllInMemoryShops(): InMemoryShop[] {
  return Array.from(shopRegistry.values());
}

export function getInMemoryShopBySlug(slug: string): InMemoryShop | undefined {
  return shopRegistry.get(slug.toLowerCase().trim());
}

export function getInMemoryShopById(id: string): InMemoryShop | undefined {
  return Array.from(shopRegistry.values()).find((s) => s._id === id);
}

export function getInMemoryShopByOwnerId(ownerId: string): InMemoryShop | undefined {
  return Array.from(shopRegistry.values()).find((s) => s.ownerId === ownerId);
}

export function saveInMemoryShop(shop: InMemoryShop) {
  shopRegistry.set(shop.slug.toLowerCase().trim(), shop);
}

export function updateInMemoryShopStatus(
  shopIdOrSlug: string,
  status: 'PENDING' | 'APPROVED' | 'REJECTED',
  rejectionReason?: string
): InMemoryShop | null {
  const shop =
    shopRegistry.get(shopIdOrSlug.toLowerCase().trim()) ||
    Array.from(shopRegistry.values()).find((s) => s._id === shopIdOrSlug);

  if (!shop) return null;

  shop.status = status;
  shop.rejectionReason = rejectionReason || '';
  shop.updatedAt = new Date().toISOString();
  shopRegistry.set(shop.slug, shop);
  return shop;
}

