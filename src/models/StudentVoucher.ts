import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudentVoucher extends Document {
  userId: string;
  userEmail: string;
  userName: string;
  institution: string;
  studentIdNumber?: string;
  phone?: string;
  gradeOrYear?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'USED';
  discountType: 'FIXED' | 'PERCENTAGE';
  discountValue: number;
  voucherAmount: number; // For backward compatibility / fixed amount fallback
  discountCode: string;
  isRedeemed: boolean;
  appliedAt: Date;
  verifiedAt?: Date;
  rejectedAt?: Date;
  usedAt?: Date;
  adminNotes?: string;
}

const StudentVoucherSchema: Schema<IStudentVoucher> = new Schema(
  {
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    institution: { type: String, required: true },
    studentIdNumber: { type: String, default: '' },
    phone: { type: String, default: '' },
    gradeOrYear: { type: String, default: '' },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED', 'USED'],
      default: 'PENDING',
      index: true,
    },
    discountType: {
      type: String,
      enum: ['FIXED', 'PERCENTAGE'],
      default: 'FIXED',
    },
    discountValue: { type: Number, default: 2500 },
    voucherAmount: { type: Number, default: 2500 }, // Stored amount in LKR
    discountCode: { type: String, default: 'STUDENT-V2CC' },
    isRedeemed: { type: Boolean, default: false },
    appliedAt: { type: Date, default: Date.now },
    verifiedAt: { type: Date },
    rejectedAt: { type: Date },
    usedAt: { type: Date },
    adminNotes: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

const StudentVoucher: Model<IStudentVoucher> =
  mongoose.models.StudentVoucher ||
  mongoose.model<IStudentVoucher>('StudentVoucher', StudentVoucherSchema);

export default StudentVoucher;
