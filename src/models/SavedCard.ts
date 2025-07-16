import mongoose, { Document, Schema } from 'mongoose';

export interface ISavedCard extends Document {
    userId: string;
    cardId: string;
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
    purchasePrice?: number;
    targetPrice?: number;
    quantity: number;
    condition: string;
    treatment: string;
    version: string;
    savedAt: Date;
    originalData: any;
    generateCardId(): string;
}

// Helper method to generate cardId from name + setCode
export function generateCardId(name: string, setCode: string): string {
    if (!name || !setCode) {
        throw new Error('Name and setCode are required to generate cardId');
    }
    // Create a consistent identifier by combining name and setCode
    // Remove special characters and normalize spacing
    const normalizedName = name.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
    const normalizedSetCode = setCode.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${normalizedName}_${normalizedSetCode}`;
}

const SavedCardSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true,
        default: 'default' // Default user for now, can be enhanced later
    },
    cardId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    setCode: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    text: {
        type: String
    },
    prices: [{
        provider: { type: String, required: true },
        date: { type: Date, required: true },
        cardType: { type: String, required: true },
        listType: { type: String, required: true },
        price: { type: Number, required: true }
    }],
    purchasePrice: {
        type: Number
    },
    targetPrice: {
        type: Number
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    condition: {
        type: String,
        required: true,
        enum: ['Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played', 'Damaged'],
        default: 'Near Mint'
    },
    treatment: {
        type: String,
        required: true,
        enum: ['Normal', 'Foil', 'Etched', 'Showcase', 'Extended Art', 'Borderless'],
        default: 'Normal'
    },
    version: {
        type: String,
        required: true,
        default: 'Standard'
    },
    savedAt: {
        type: Date,
        default: Date.now
    },
    originalData: {
        type: Schema.Types.Mixed
    }
});

// Add compound unique index for userId + cardId duplicate prevention
SavedCardSchema.index({ userId: 1, cardId: 1 }, { unique: true });

// Add additional indexes for efficient queries
SavedCardSchema.index({ userId: 1 });
SavedCardSchema.index({ savedAt: 1 });

// Add instance method to generate cardId
SavedCardSchema.methods.generateCardId = function (): string {
    return generateCardId(this.name, this.setCode);
};

// Pre-save middleware to automatically generate cardId if not provided
SavedCardSchema.pre('save', function (next) {
    if (!this.cardId) {
        this.cardId = generateCardId(this.name, this.setCode);
    }
    next();
});

export default mongoose.model<ISavedCard>('SavedCard', SavedCardSchema);