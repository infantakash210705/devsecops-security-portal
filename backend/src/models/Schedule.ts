import mongoose, { Schema, Document } from 'mongoose';

export interface ISchedule extends Document {
  employeeId: mongoose.Types.ObjectId;
  day: string;
  task: string;
  time: string;
}

const ScheduleSchema: Schema = new Schema(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    day: { type: String, required: true },
    task: { type: String, required: true },
    time: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISchedule>('Schedule', ScheduleSchema);
