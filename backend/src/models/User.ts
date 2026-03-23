import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'admin' | 'employee';
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
