import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IShop extends Document {
  ownerId: mongoose.Types.ObjectId | string;
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
  rating?: number;
  totalProducts?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ShopSchema = new Schema<IShop>(
  {
    ownerId: { type: Schema.Types.Mixed, required: true },
    ownerEmail: { type: String, required: true, lowercase: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    ownerPhone: { type: String, required: true, trim: true },
    shopName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, default: 'General Store' },
    city: { type: String, required: true, default: 'Colombo' },
    address: { type: String },
    logoUrl: { type: String },
    bannerUrl: { type: String },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    rejectionReason: { type: String },
    rating: { type: Number, default: 4.8 },
    totalProducts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Shop: Model<IShop> = mongoose.models.Shop || mongoose.model<IShop>('Shop', ShopSchema);

export default Shop;

