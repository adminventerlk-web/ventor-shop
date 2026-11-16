import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDonationRequest extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const DonationRequestSchema = new Schema<IDonationRequest>(
  {
    requestId: { type: String, required: true, unique: true },
    initiativeId: { type: String, required: true },
    initiativeTitle: { type: String, required: true },
    applicantName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    nicOrId: { type: String, required: true, trim: true },
    city: { type: String, required: true },
    province: { type: String, default: '' },
    requestedAmount: { type: Number, required: true, min: 0 },
    reason: { type: String, required: true },
    supportingInfo: { type: String },
    status: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'DISBURSED', 'REJECTED'],
      default: 'PENDING',
    },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

const DonationRequest: Model<IDonationRequest> =
  mongoose.models.DonationRequest ||
  mongoose.model<IDonationRequest>('DonationRequest', DonationRequestSchema);

export default DonationRequest;
