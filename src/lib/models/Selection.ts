import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ISelection extends Document {
  selectedGiftId: string | null;
  customText?: string;
  openedGiftIds: string[];
  timestamp: number;
  userAgent?: string;
  createdAt: Date;
}

const SelectionSchema = new Schema<ISelection>(
  {
    selectedGiftId: { type: String, default: null },
    customText: { type: String },
    openedGiftIds: { type: [String], default: [] },
    timestamp: { type: Number, required: true },
    userAgent: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

// Clear cached model to ensure schema updates take effect
delete mongoose.models.Selection;

const Selection: Model<ISelection> =
  mongoose.model<ISelection>('Selection', SelectionSchema);

export default Selection;
