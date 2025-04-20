import mongoose, { Document, Schema } from 'mongoose';

export interface IScrapedData extends Document {
  url: string;
  title: string;
  content: string;
  scrapedAt: Date;
}

const ScrapedDataSchema: Schema = new Schema({
  url: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  scrapedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IScrapedData>('ScrapedData', ScrapedDataSchema);
