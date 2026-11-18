import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAd extends Document {
  title: string;
  shopName: string;
  shopCategory: string;
  tagline: string;
  badge: string;
  highlightStat: string;
  images: string[];
  ctaText: string;
  ctaLink: string;
  accentColor: string;
  offerPill?: string;
  rating?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const AdSchema = new Schema<IAd>(
  {
    title: { type: String, required: true, trim: true },
    shopName: { type: String, required: true, trim: true },
    shopCategory: { type: String, required: true, default: 'Partner Merchant' },
    tagline: { type: String, required: true, trim: true },
    badge: { type: String, default: 'Partner Store Showcase' },
    highlightStat: { type: String, default: 'Verified Quality Vendor' },
    images: {
      type: [String],
      required: true,
      default: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'],
    },
    ctaText: { type: String, default: 'Visit Partner Store' },
    ctaLink: { type: String, default: '/virtual-shops' },
    accentColor: { type: String, default: '#FFB800' },
    offerPill: { type: String, default: '🔥 Verified Partner Store' },
    rating: { type: String, default: '4.9 ★ Verified Partner' },
    isActive: { type: Boolean, default: true, index: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Ad: Model<IAd> = mongoose.models.Ad || mongoose.model<IAd>('Ad', AdSchema);

export default Ad;
