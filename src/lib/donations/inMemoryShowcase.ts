// In-memory store for VentorShop completed donation records showcase

export interface InMemoryDonationRecord {
  _id: string;
  title: string;
  amount: number;
  category: 'EDUCATION' | 'AGRICULTURE' | 'HEALTHCARE' | 'EMERGENCY_RELIEF' | 'COMMUNITY' | 'ORPHANAGE';
  beneficiary: string;
  location: string;
  date: string;
  description: string;
  imageUrl: string;
  badge: string;
  status: 'COMPLETED' | 'ACTIVE';
  featured: boolean;
  createdAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var globalDonationShowcase: InMemoryDonationRecord[] | undefined;
}

const DEFAULT_RECORDS: InMemoryDonationRecord[] = [
  {
    _id: 'don-01',
    title: 'School Bags, Textbooks & Stationery Packs for 150 Underprivileged Students',
    amount: 320000,
    category: 'EDUCATION',
    beneficiary: 'Vadamarachchi Rural Primary School Students',
    location: 'Jaffna, Northern Province',
    date: 'October 2026',
    description:
      'Direct distribution of 150 complete annual schooling kits containing durable backpacks, bilingual exercise books, geometry sets, mathematical instruments, and footwear for low-income grade 1–5 students.',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    badge: '100% Platform Revenue Share',
    status: 'COMPLETED',
    featured: true,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    _id: 'don-02',
    title: 'Solar Water Pump & Organic Fertilizer Subsidy for Smallholder Cinnamon Farmers',
    amount: 450000,
    category: 'AGRICULTURE',
    beneficiary: 'Ceylon Organic Spice Cultivators Collective',
    location: 'Matale & Kandy',
    date: 'September 2026',
    description:
      'Funded 2 solar-powered drip irrigation units and 60 bags of certified organic bio-fertilizer for 25 smallholder spice farming families to withstand seasonal droughts and maintain organic export standards.',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d691068c2?auto=format&fit=crop&w=800&q=80',
    badge: 'Farmer Community Grant',
    status: 'COMPLETED',
    featured: true,
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
  },
  {
    _id: 'don-03',
    title: 'Emergency Dialysis Treatment Fund & Critical Prescription Aid for 18 Patients',
    amount: 275000,
    category: 'HEALTHCARE',
    beneficiary: 'Southern Regional Hospital Dialysis Support Unit',
    location: 'Galle, Southern Province',
    date: 'August 2026',
    description:
      'Direct payment for 36 emergency hemodialysis sessions, vital insulin supplies, and essential cardiac maintenance prescriptions for elderly patients unable to afford private clinic care.',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    badge: 'Direct Emergency Medical Aid',
    status: 'COMPLETED',
    featured: true,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
];

export function getInMemoryDonations(): InMemoryDonationRecord[] {
  if (!global.globalDonationShowcase) {
    global.globalDonationShowcase = [...DEFAULT_RECORDS];
  }
  return global.globalDonationShowcase;
}

export function saveInMemoryDonation(record: InMemoryDonationRecord): InMemoryDonationRecord {
  const list = getInMemoryDonations();
  const idx = list.findIndex((r) => r._id === record._id);
  if (idx >= 0) {
    list[idx] = record;
  } else {
    list.unshift(record);
  }
  return record;
}

export function deleteInMemoryDonation(id: string): boolean {
  const list = getInMemoryDonations();
  const idx = list.findIndex((r) => r._id === id);
  if (idx >= 0) {
    list.splice(idx, 1);
    return true;
  }
  return false;
}
