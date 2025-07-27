import SavedCard, { ISavedCard, generateCardId } from '../../src/models/SavedCard';

describe('SavedCard Model', () => {
    describe('generateCardId function', () => {
        it('should generate a consistent cardId from name and setCode', () => {
            const cardId = generateCardId('Lightning Bolt', 'M21');
            expect(cardId).toBe('lightning-bolt_m21');
        });

        it('should handle special characters in card names', () => {
            const cardId = generateCardId("Jace, the Mind Sculptor", 'WWK');
            expect(cardId).toBe('jace-the-mind-sculptor_wwk');
        });

        it('should throw error if name or setCode is missing', () => {
            expect(() => generateCardId('', 'M21')).toThrow('Name and setCode are required');
            expect(() => generateCardId('Lightning Bolt', '')).toThrow('Name and setCode are required');
        });
    });

    describe('SavedCard creation and saving', () => {
        it('should save a card with all required fields', async () => {
            const cardData = {
                name: 'Lightning Bolt',
                setCode: 'M21',
                type: 'Instant',
                text: 'Lightning Bolt deals 3 damage to any target.',
                quantity: 1,
                condition: 'Near Mint' as const,
                treatment: 'Normal' as const,
                version: 'Standard',
                prices: [{
                    provider: 'tcgplayer',
                    date: new Date(),
                    cardType: 'normal',
                    listType: 'market',
                    price: 0.25
                }]
            };

            const savedCard = new SavedCard(cardData);
            const result = await savedCard.save();

            expect(result._id).toBeDefined();
            expect(result.name).toBe('Lightning Bolt');
            expect(result.setCode).toBe('M21');
            expect(result.cardId).toBe('lightning-bolt_m21'); // Should be auto-generated
            expect(result.userId).toBe('default'); // Default value
            expect(result.savedAt).toBeDefined();
        });

        it('should auto-generate cardId if not provided', async () => {
            const cardData = {
                name: 'Counterspell',
                setCode: 'M21',
                type: 'Instant',
                quantity: 1,
                condition: 'Near Mint' as const,
                treatment: 'Normal' as const,
                version: 'Standard',
                prices: []
            };

            const savedCard = new SavedCard(cardData);
            const result = await savedCard.save();

            expect(result.cardId).toBe('counterspell_m21');
        });

        it('should not override cardId if already provided', async () => {
            const cardData = {
                cardId: 'custom-card-id',
                name: 'Lightning Bolt',
                setCode: 'M21',
                type: 'Instant',
                quantity: 1,
                condition: 'Near Mint' as const,
                treatment: 'Normal' as const,
                version: 'Standard',
                prices: []
            };

            const savedCard = new SavedCard(cardData);
            const result = await savedCard.save();

            expect(result.cardId).toBe('custom-card-id');
        });

        it('should enforce required fields', async () => {
            const cardData = {
                // Missing required fields: name, setCode, type
                quantity: 1,
                condition: 'Near Mint' as const,
                treatment: 'Normal' as const,
                version: 'Standard',
                prices: []
            };

            const savedCard = new SavedCard(cardData);

            await expect(savedCard.save()).rejects.toThrow();
        });

        it('should enforce valid condition values', async () => {
            const cardData = {
                name: 'Lightning Bolt',
                setCode: 'M21',
                type: 'Instant',
                quantity: 1,
                condition: 'Invalid Condition' as any, // Invalid condition
                treatment: 'Normal' as const,
                version: 'Standard',
                prices: []
            };

            const savedCard = new SavedCard(cardData);

            await expect(savedCard.save()).rejects.toThrow();
        });

        it('should prevent duplicate cards for same user', async () => {
            const cardData = {
                userId: 'user123',
                name: 'Lightning Bolt',
                setCode: 'M21',
                type: 'Instant',
                quantity: 1,
                condition: 'Near Mint' as const,
                treatment: 'Normal' as const,
                version: 'Standard',
                prices: []
            };

            // Save first card
            const firstCard = new SavedCard(cardData);
            await firstCard.save();

            // Try to save duplicate
            const duplicateCard = new SavedCard(cardData);

            await expect(duplicateCard.save()).rejects.toThrow();
        });
    });
});