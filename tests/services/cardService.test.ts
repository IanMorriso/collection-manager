import { saveCardToDB } from '../../src/services/cardService';
import SavedCard from '../../src/models/SavedCard';

describe('CardService', () => {
  describe('saveCardToDB', () => {
    it('should save a card to the database', async () => {
      const cardData = {
        name: 'Black Lotus',
        setCode: 'LEA',
        type: 'Artifact',
        text: '{T}, Sacrifice Black Lotus: Add three mana of any one color.',
        quantity: 1,
        condition: 'Near Mint' as const,
        treatment: 'Normal' as const,
        version: 'Standard',
        prices: [{
          provider: 'tcgplayer',
          date: new Date(),
          cardType: 'normal',
          listType: 'market',
          price: 25000.00
        }],
        purchasePrice: 20000.00,
        targetPrice: 30000.00
      };

      const result = await saveCardToDB(cardData as any);

      expect(result._id).toBeDefined();
      expect(result.name).toBe('Black Lotus');
      expect(result.setCode).toBe('LEA');
      expect(result.cardId).toBe('black-lotus_lea');
      expect(result.purchasePrice).toBe(20000.00);
      expect(result.targetPrice).toBe(30000.00);
      expect(result.quantity).toBe(1);
    });

    it('should save a card with minimal required fields', async () => {
      const cardData = {
        name: 'Forest',
        setCode: 'M21',
        type: 'Basic Land',
        quantity: 4,
        condition: 'Lightly Played' as const,
        treatment: 'Foil' as const,
        version: 'Standard',
        prices: []
      };

      const result = await saveCardToDB(cardData as any);

      expect(result._id).toBeDefined();
      expect(result.name).toBe('Forest');
      expect(result.condition).toBe('Lightly Played');
      expect(result.treatment).toBe('Foil');
      expect(result.quantity).toBe(4);
    });

    it('should handle cards with complex pricing data', async () => {
      const cardData = {
        name: 'Tarmogoyf',
        setCode: 'MM3',
        type: 'Creature — Lhurgoyf',
        text: "Tarmogoyf's power is equal to the number of card types among cards in all graveyards and its toughness is equal to that number plus 1.",
        quantity: 2,
        condition: 'Moderately Played' as const,
        treatment: 'Normal' as const,
        version: 'Standard',
        prices: [
          {
            provider: 'tcgplayer',
            date: new Date('2023-01-01'),
            cardType: 'normal',
            listType: 'market',
            price: 45.99
          },
          {
            provider: 'cardkingdom',
            date: new Date('2023-01-01'),
            cardType: 'normal',
            listType: 'buylist',
            price: 35.00
          }
        ]
      };

      const result = await saveCardToDB(cardData as any);

      expect(result.prices).toHaveLength(2);
      expect(result.prices[0].provider).toBe('tcgplayer');
      expect(result.prices[0].price).toBe(45.99);
      expect(result.prices[1].provider).toBe('cardkingdom');
      expect(result.prices[1].price).toBe(35.00);
    });

    it('should verify the card exists in database after saving', async () => {
      const cardData = {
        name: 'Sol Ring',
        setCode: 'C21',
        type: 'Artifact',
        quantity: 1,
        condition: 'Near Mint' as const,
        treatment: 'Normal' as const,
        version: 'Standard',
        prices: []
      };

      const savedCard = await saveCardToDB(cardData as any);
      
      // Verify it exists in the database
      const foundCard = await SavedCard.findById(savedCard._id);
      
      expect(foundCard).toBeTruthy();
      expect(foundCard?.name).toBe('Sol Ring');
      expect(foundCard?.cardId).toBe('sol-ring_c21');
    });
  });
});