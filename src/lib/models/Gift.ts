import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IGift extends Document {
  title: string;
  description: string;
  images: string[];
  enabled: boolean;
  order: number;
  isCustomText?: boolean;
  customText?: string;
  showInSelection?: boolean;  // Show on Page 5 (Gift Selection)
  showInLuckGame?: boolean;   // Show on Page 6 (Luck Game)
  createdAt: Date;
  updatedAt: Date;
}

const GiftSchema = new Schema<IGift>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    enabled: { type: Boolean, default: true },
    order: { type: Number, required: true },
    isCustomText: { type: Boolean, default: false },
    customText: { type: String, default: '' },
    showInSelection: { type: Boolean, default: true },  // Show on Page 5
    showInLuckGame: { type: Boolean, default: true },   // Show on Page 6
  },
  {
    timestamps: true,
  }
);

const Gift: Model<IGift> = mongoose.models.Gift || mongoose.model<IGift>('Gift', GiftSchema);

export default Gift;
