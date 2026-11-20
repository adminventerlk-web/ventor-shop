import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDonationShowcase extends Document {
  title: string;
  amount: number; // Amount donated in LKR
  category: 'EDUCATION' | 'AGRICULTURE' | 'HEALTHCARE' | 'EMERGENCY_RELIEF' | 'COMMUNITY' | 'ORPHANAGE';
  beneficiary: string;
  location: string;
  date: string;
  description: string;
  imageUrl?: string;
  badge?: string;
  status: 'COMPLETED' | 'ACTIVE';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DonationShowcaseSchema = new Schema<IDonationShowcase>(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ['EDUCATION', 'AGRICULTURE', 'HEALTHCARE', 'EMERGENCY_RELIEF', 'COMMUNITY', 'ORPHANAGE'],
      default: 'COMMUNITY',
    },
    beneficiary: { type: String, required: true, trim: true },
    location: { type: String, required: true, default: 'Sri Lanka' },
    date: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?auto=format&fit=crop&w=800&q=80',
    },
    badge: { type: String, default: 'Platform Revenue Share • 100% Funded' },
    status: {
      type: String,
      enum: ['COMPLETED', 'ACTIVE'],
      default: 'COMPLETED',
    },
    featured: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const DonationShowcase: Model<IDonationShowcase> =
  mongoose.models.DonationShowcase ||
  mongoose.model<IDonationShowcase>('DonationShowcase', DonationShowcaseSchema);

export default DonationShowcase;
