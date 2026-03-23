import mongoose, { Schema, Document } from 'mongoose';

export interface ILoginLog extends Document {
  username: string;
  ip: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  attempts: number;
  location?: string;
  timestamp: Date;
}

const LoginLogSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    ip: { type: String, required: true },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'BLOCKED'],
      required: true,
    },
    attempts: { type: Number, default: 1 },
    location: { type: String, default: 'Unknown' },
    timestamp: { type: Date, default: Date.now },
  }
);

export default mongoose.model<ILoginLog>('LoginLog', LoginLogSchema);
