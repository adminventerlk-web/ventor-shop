import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAuditLog extends Document {
  adminId?: mongoose.Types.ObjectId;
  adminEmail: string;
  adminName: string;
  action: string; // e.g. 'STUDENT_VOUCHER_VERIFIED', 'PRODUCT_UPDATED', 'ORDER_STATUS_CHANGED'
  targetModel: string; // e.g. 'StudentVoucher', 'Product', 'Order', 'Setting'
  targetId?: string;
  details: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'User' },
    adminEmail: { type: String, required: true, lowercase: true, index: true },
    adminName: { type: String, required: true },
    action: { type: String, required: true, index: true },
    targetModel: { type: String, required: true, default: 'System' },
    targetId: { type: String, default: '' },
    details: { type: String, required: true },
    ipAddress: { type: String, default: '127.0.0.1' },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;
