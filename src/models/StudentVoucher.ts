import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudentVoucher extends Document {
  userId: string;
  userEmail: string;
  userName: string;
  institution: string;
  studentIdNumber?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'USED';
  voucherAmount: number;
  discountCode: string;
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
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED', 'USED'],
      default: 'PENDING',
      index: true,
    },
    voucherAmount: { type: Number, default: 2500 }, // Default voucher value
    discountCode: { type: String, default: 'STUDENT-V2CC' },
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
