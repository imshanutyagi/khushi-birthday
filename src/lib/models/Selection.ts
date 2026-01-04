import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ISelection extends Document {
  selectedGiftId: string | null;
  openedGiftIds: string[];
  timestamp: number;
  userAgent?: string;
  createdAt: Date;
}

const SelectionSchema = new Schema<ISelection>(
  {
    selectedGiftId: { type: String, default: null },
    openedGiftIds: { type: [String], default: [] },
    timestamp: { type: Number, required: true },
    userAgent: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

const Selection: Model<ISelection> =
  mongoose.models.Selection || mongoose.model<ISelection>('Selection', SelectionSchema);

export default Selection;
