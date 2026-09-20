import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string; // Cloudinary secure URL
  icon?: string;   // Icon identifier code
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema(
  {
    _id: { type: Schema.Types.Mixed, default: () => new mongoose.Types.ObjectId() },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    description: { type: String },
    image: { type: String },
    icon: { type: String, default: 'Layers' },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Prevent mongoose from recreating model on hot reloading
const Category: Model<ICategory> = (mongoose.models.Category as Model<ICategory>) || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
