import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICommunityProgramVoucher extends Document {
  title: string;
  supportedBy: string;
  communityType: 'FAMILY_SUPPORT' | 'V2CC_PMS' | 'WHOLESALE' | 'GENERAL';
  voucherCode: string;
  discountType: 'FIXED' | 'PERCENTAGE';
  discountValue: number;
  voucherAmount: number;
  status: 'ON' | 'OFF';
  noticeMessage?: string;
  features: string[];
  usedByUserIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CommunityProgramVoucherSchema: Schema<ICommunityProgramVoucher> = new Schema(
  {
    title: { type: String, required: true },
    supportedBy: { type: String, required: true },
    communityType: {
      type: String,
      enum: ['FAMILY_SUPPORT', 'V2CC_PMS', 'WHOLESALE', 'GENERAL'],
      default: 'V2CC_PMS',
    },
    voucherCode: { type: String, required: true, uppercase: true, trim: true },
    discountType: {
      type: String,
      enum: ['FIXED', 'PERCENTAGE'],
      default: 'FIXED',
    },
    discountValue: { type: Number, default: 3000 },
    voucherAmount: { type: Number, default: 3000 },
    status: { type: String, enum: ['ON', 'OFF'], default: 'ON' },
    noticeMessage: { type: String, default: '' },
    features: [{ type: String }],
    usedByUserIds: [{ type: String }],
  },
  { timestamps: true }
);

const CommunityProgramVoucher: Model<ICommunityProgramVoucher> =
  mongoose.models.CommunityProgramVoucher ||
  mongoose.model<ICommunityProgramVoucher>('CommunityProgramVoucher', CommunityProgramVoucherSchema);

export default CommunityProgramVoucher;
