import mongoose, { Schema, Document, Model } from 'mongoose';

export type AdRequestStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'EXPIRED';

export interface IAdvertisementRequest extends Document {
  trackingCode: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  shopLocation: string;
  websiteOrSocial?: string;
  advertisementTitle: string;
  description: string;
  productsToPromote?: string;
  preferredPlacement: 'HOMEPAGE_FEATURED' | 'DISCOVER_SHOPS' | 'SHOP_PAGE' | 'CATEGORY_PAGE' | 'SPECIAL_OFFERS';
  requestedStartDate?: Date;
  requestedEndDate?: Date;
  logo?: string;
  images: string[];
  destinationUrl?: string;
  status: AdRequestStatus;
  adminFeedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdvertisementRequestSchema = new Schema<IAdvertisementRequest>(
  {
    trackingCode: { type: String, required: true, unique: true, index: true },
    businessName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    category: { type: String, required: true, default: 'General Store' },
    shopLocation: { type: String, required: true, default: 'Colombo' },
    websiteOrSocial: { type: String, trim: true },
    advertisementTitle: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    productsToPromote: { type: String, trim: true },
    preferredPlacement: {
      type: String,
      enum: ['HOMEPAGE_FEATURED', 'DISCOVER_SHOPS', 'SHOP_PAGE', 'CATEGORY_PAGE', 'SPECIAL_OFFERS'],
      default: 'HOMEPAGE_FEATURED',
    },
    requestedStartDate: { type: Date },
    requestedEndDate: { type: Date },
    logo: { type: String },
    images: {
      type: [String],
      required: true,
      default: [],
    },
    destinationUrl: { type: String, trim: true },
    status: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ACTIVE', 'EXPIRED'],
      default: 'PENDING',
      index: true,
    },
    adminFeedback: { type: String, trim: true },
  },
  { timestamps: true }
);

const AdvertisementRequest: Model<IAdvertisementRequest> =
  mongoose.models.AdvertisementRequest ||
  mongoose.model<IAdvertisementRequest>('AdvertisementRequest', AdvertisementRequestSchema);

export default AdvertisementRequest;
