import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICommunityProgramVoucher extends Document {
  title: string;
  supportedBy: string;
  communityType: 'FAMILY_SUPPORT' | 'V2CC_PMS' | 'WHOLESALE' | 'GENERAL';
  voucherCode: string;
  voucherAmount: number;
  status: 'ON' | 'OFF';
  noticeMessage?: string;
  features: string[];
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
      default: 'FAMILY_SUPPORT',
    },
    voucherCode: { type: String, required: true, uppercase: true, trim: true },
    voucherAmount: { type: Number, default: 3000 },
    status: { type: String, enum: ['ON', 'OFF'], default: 'OFF' },
    noticeMessage: { type: String, default: '' },
    features: [{ type: String }],
  },
  { timestamps: true }
);

const CommunityProgramVoucher: Model<ICommunityProgramVoucher> =
  mongoose.models.CommunityProgramVoucher ||
  mongoose.model<ICommunityProgramVoucher>('CommunityProgramVoucher', CommunityProgramVoucherSchema);

export default CommunityProgramVoucher;
