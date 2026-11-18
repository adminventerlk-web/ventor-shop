import mongoose, { Schema, Document, Model } from 'mongoose';

export type AdPlacement = 'HOMEPAGE_FEATURED' | 'DISCOVER_SHOPS' | 'SHOP_PAGE' | 'CATEGORY_PAGE' | 'SPECIAL_OFFERS';
export type AdStatus = 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'DRAFT';
export type ImageAspectRatio = 'AUTO' | 'POSTER' | 'LANDSCAPE' | 'SQUARE';

export interface IAdvertisement extends Document {
  requestId?: mongoose.Types.ObjectId | string;
  businessName: string;
  shopName: string; // compatibility alias
  shopLogo?: string;
  title: string;
  description: string;
  tagline: string; // compatibility alias
  images: string[];
  featuredImage?: string;
  destinationUrl: string;
  ctaText: string;
  ctaLink?: string; // compatibility alias
  category: string;
  shopCategory?: string; // compatibility alias
  placement: AdPlacement;
  displayOrder: number;
  startDate?: Date;
  endDate?: Date;
  offerPill?: string;
  rating?: string;
  badge?: string;
  highlightStat?: string;
  accentColor: string;
  aspectRatioPreference: ImageAspectRatio;
  status: AdStatus;
  isActive: boolean; // compatibility flag
  createdAt: Date;
  updatedAt: Date;
}

const AdvertisementSchema = new Schema<IAdvertisement>(
  {
    requestId: { type: Schema.Types.Mixed },
    businessName: { type: String, required: true, trim: true },
    shopName: { type: String, trim: true },
    shopLogo: { type: String },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    tagline: { type: String, trim: true },
    images: {
      type: [String],
      required: true,
      validate: [(val: string[]) => val.length > 0, 'At least one image is required.'],
    },
    featuredImage: { type: String },
    destinationUrl: { type: String, required: true, default: '/virtual-shops', trim: true },
    ctaText: { type: String, default: 'Visit Shop', trim: true },
    ctaLink: { type: String, trim: true },
    category: { type: String, default: 'General Store', trim: true },
    shopCategory: { type: String, trim: true },
    placement: {
      type: String,
      enum: ['HOMEPAGE_FEATURED', 'DISCOVER_SHOPS', 'SHOP_PAGE', 'CATEGORY_PAGE', 'SPECIAL_OFFERS'],
      default: 'HOMEPAGE_FEATURED',
      index: true,
    },
    displayOrder: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    offerPill: { type: String, default: '🔥 Special Promotion', trim: true },
    rating: { type: String, default: '4.9 ★ Verified Partner', trim: true },
    badge: { type: String, default: 'Official Partner Spotlight', trim: true },
    highlightStat: { type: String, default: '50K+ Monthly Shoppers Reached', trim: true },
    accentColor: { type: String, default: '#FFB800', trim: true },
    aspectRatioPreference: {
      type: String,
      enum: ['AUTO', 'POSTER', 'LANDSCAPE', 'SQUARE'],
      default: 'AUTO',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'PAUSED', 'EXPIRED', 'DRAFT'],
      default: 'ACTIVE',
      index: true,
    },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// Pre-save hook to ensure compatibility aliases are synchronized
AdvertisementSchema.pre('save', function () {
  if (!this.shopName) this.shopName = this.businessName;
  if (!this.businessName) this.businessName = this.shopName;
  if (!this.tagline) this.tagline = this.description;
  if (!this.description) this.description = this.tagline;
  if (!this.ctaLink) this.ctaLink = this.destinationUrl;
  if (!this.destinationUrl) this.destinationUrl = this.ctaLink;
  if (!this.shopCategory) this.shopCategory = this.category;
  if (!this.category) this.category = this.shopCategory;
  if (!this.featuredImage && this.images && this.images.length > 0) {
    this.featuredImage = this.images[0];
  }
  this.isActive = this.status === 'ACTIVE';
});

const Advertisement: Model<IAdvertisement> =
  mongoose.models.Advertisement || mongoose.model<IAdvertisement>('Advertisement', AdvertisementSchema);

export default Advertisement;
