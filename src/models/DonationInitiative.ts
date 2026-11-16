import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDonationInitiative extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const DonationInitiativeSchema = new Schema<IDonationInitiative>(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['EDUCATION', 'AGRICULTURE', 'HEALTHCARE', 'EMERGENCY_RELIEF', 'COMMUNITY'],
      default: 'COMMUNITY',
    },
    allocatedAmount: { type: Number, required: true, min: 0 },
    disbursedAmount: { type: Number, default: 0, min: 0 },
    maxPerApplicant: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    eligibility: { type: String, required: true },
    bannerImage: { type: String },
    status: {
      type: String,
      enum: ['ACTIVE', 'PAUSED', 'COMPLETED'],
      default: 'ACTIVE',
    },
    badge: { type: String, default: 'Platform Revenue Share' },
    applicationCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const DonationInitiative: Model<IDonationInitiative> =
  mongoose.models.DonationInitiative ||
  mongoose.model<IDonationInitiative>('DonationInitiative', DonationInitiativeSchema);

export default DonationInitiative;
