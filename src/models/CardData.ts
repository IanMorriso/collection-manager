import mongoose, { Document, Schema } from 'mongoose';

export interface ICardData extends Document {
  name: string;
  setCode: string;
  type: string;
  text: string;
  prices: Array<{
    provider: string;
    date: Date;
    cardType: string;
    listType: string;
    price: number;
  }>;
  collectedAt: Date;
}

const CardDataSchema: Schema = new Schema({
  name: { type: String, required: true },
  setCode: { type: String, required: true },
  type: { type: String, required: true },
  text: { type: String },
  prices: [
    {
      provider: String,
      date: Date,
      cardType: String,
      listType: String,
      price: Number,
    },
  ],
  collectedAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICardData>('CardData', CardDataSchema);
