// In-Memory store for Super Admin Revenue Donation Initiatives & Community Aid Requests

export interface InMemoryInitiative {
  _id: string;
  title: string;
  category: 'EDUCATION' | 'AGRICULTURE' | 'HEALTHCARE' | 'EMERGENCY_RELIEF' | 'COMMUNITY';
  allocatedAmount: number;
  disbursedAmount: number;
  maxPerApplicant: number;
  description: string;
  eligibility: string;
  bannerImage?: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  badge?: string;
  applicationCount: number;
  createdAt: string;
}

export interface InMemoryRequest {
  _id: string;
  requestId: string;
  initiativeId: string;
  initiativeTitle: string;
  applicantName: string;
  email: string;
  phone: string;
  nicOrId: string;
  city: string;
  province?: string;
  requestedAmount: number;
  reason: string;
  supportingInfo?: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'DISBURSED' | 'REJECTED';
  adminNotes?: string;
  createdAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var globalDonationInitiatives: InMemoryInitiative[] | undefined;
  // eslint-disable-next-line no-var
  var globalDonationRequests: InMemoryRequest[] | undefined;
}

const DEFAULT_INITIATIVES: InMemoryInitiative[] = [
  {
    _id: 'init-edu-01',
    title: 'Sri Lanka Higher Education & Student Skills Grant',
    category: 'EDUCATION',
    allocatedAmount: 600000,
    disbursedAmount: 220000,
    maxPerApplicant: 30000,
    description:
      'Funded directly by VENTERSHOP platform revenue. Providing one-time financial grants for university students and technical diploma trainees to purchase textbooks, pay exam registration fees, and acquire study laptops.',
    eligibility:
      'Undergraduate students and vocational trainees currently enrolled in recognized Sri Lankan universities/colleges with household monthly income under LKR 60,000.',
    bannerImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    status: 'ACTIVE',
    badge: '10% Revenue Share',
    applicationCount: 14,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    _id: 'init-agri-02',
    title: 'Ceylon Organic Spice Farmers & Cultivator Fund',
    category: 'AGRICULTURE',
    allocatedAmount: 850000,
    disbursedAmount: 315000,
    maxPerApplicant: 40000,
    description:
      'Supporting rural spice growers in Kandy, Matale, and Galle. Grants assist with purchasing organic bio-fertilizer, quality nursery seedling trays, solar drying nets, and pest protection to sustain genuine Ceylon organic exports.',
    eligibility:
      'Smallholder family farms cultivating cinnamon, black pepper, cardamom, clove, or nutmeg with landholding under 2 acres.',
    bannerImage: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
    status: 'ACTIVE',
    badge: 'Direct Farmer Support',
    applicationCount: 22,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    _id: 'init-med-03',
    title: 'Underprivileged Family Emergency Medical Aid',
    category: 'HEALTHCARE',
    allocatedAmount: 450000,
    disbursedAmount: 180000,
    maxPerApplicant: 25000,
    description:
      'Immediate cash grant aid to help families facing emergency hospitalization bills, vital monthly diabetic/cardiac prescriptions, and urgent specialized diagnostic scans not covered by standard state clinics.',
    eligibility:
      'Families experiencing documented medical hardship or unexpected surgical costs. Medical prescription / doctor invoice copy required upon review.',
    bannerImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    status: 'ACTIVE',
    badge: 'Emergency Welfare',
    applicationCount: 18,
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
];

const DEFAULT_REQUESTS: InMemoryRequest[] = [
  {
    _id: 'req-001',
    requestId: 'AID-2026-00142',
    initiativeId: 'init-edu-01',
    initiativeTitle: 'Sri Lanka Higher Education & Student Skills Grant',
    applicantName: 'Kavindi Disanayake',
    email: 'kavindi.d@gmail.com',
    phone: '+94 77 412 8891',
    nicOrId: '200185401923',
    city: 'Peradeniya',
    province: 'Central Province',
    requestedAmount: 28000,
    reason:
      'Final year BSc Agriculture student needing assistance to complete semester tuition and publish final year organic crop research paper.',
    supportingInfo: 'University ID: AG/2021/045',
    status: 'PENDING',
    adminNotes: '',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    _id: 'req-002',
    requestId: 'AID-2026-00139',
    initiativeId: 'init-agri-02',
    initiativeTitle: 'Ceylon Organic Spice Farmers & Cultivator Fund',
    applicantName: 'S. Ramanathan',
    email: 'ramanathan.spices@gmail.com',
    phone: '+94 71 892 4110',
    nicOrId: '761928341V',
    city: 'Matale',
    province: 'Central Province',
    requestedAmount: 40000,
    reason:
      'Need to purchase solar drying net frames and nursery shade netting for organic black pepper harvesting season.',
    supportingInfo: 'Farm land registration no: MT/AG/881',
    status: 'APPROVED',
    adminNotes: 'Verified with Matale agricultural extension officer. Approved for payout.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    _id: 'req-003',
    requestId: 'AID-2026-00135',
    initiativeId: 'init-med-03',
    initiativeTitle: 'Underprivileged Family Emergency Medical Aid',
    applicantName: 'Mohamed Farook',
    email: 'm.farook@yahoo.com',
    phone: '+94 76 331 9022',
    nicOrId: '820491823V',
    city: 'Batticaloa',
    province: 'Eastern Province',
    requestedAmount: 25000,
    reason:
      'Assistance needed for post-cardiac surgery follow-up prescriptions and specialized diagnostic lab work.',
    supportingInfo: 'Teaching Hospital Batticaloa Clinic Card #BTT-994',
    status: 'DISBURSED',
    adminNotes: 'Direct bank transfer completed via Commercial Bank. Receipt acknowledged.',
    createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
  },
];

export const inMemoryInitiatives: InMemoryInitiative[] =
  global.globalDonationInitiatives || DEFAULT_INITIATIVES;
if (!global.globalDonationInitiatives) {
  global.globalDonationInitiatives = inMemoryInitiatives;
}

export const inMemoryRequests: InMemoryRequest[] =
  global.globalDonationRequests || DEFAULT_REQUESTS;
if (!global.globalDonationRequests) {
  global.globalDonationRequests = inMemoryRequests;
}
