import SavedCard from '../../src/models/SavedCard';
import { saveCardToDB } from '../../src/services/cardService';

describe('Card Persistence Integration', () => {
  it('should save and retrieve a complete card workflow', async () => {
    // Step 1: Create card data as it might come from the API
    const apiCardData = {
      name: 'Snapcaster Mage',
      setCode: 'ISD',
      type: 'Creature — Human Wizard',
      text: 'Flash\nWhen Snapcaster Mage enters the battlefield, target instant or sorcery card in your graveyard gains flashback until end of turn.',
      prices: [
        {
          provider: 'tcgplayer',
          date: new Date(),
          cardType: 'normal',
          listType: 'market',
          price: 12.50
        }
      ]
    };

    // Step 2: Add user collection data
    const collectionData = {
      ...apiCardData,
      quantity: 2,
      condition: 'Near Mint' as const,
      treatment: 'Normal' as const,
      version: 'Standard',
      purchasePrice: 10.00,
      targetPrice: 15.00,
      userId: 'testuser123'
    };

    // Step 3: Save to database
    const savedCard = await saveCardToDB(collectionData as any);

    // Step 4: Verify save was successful
    expect(savedCard._id).toBeDefined();
    expect(savedCard.cardId).toBe('snapcaster-mage_isd');
    expect(savedCard.userId).toBe('testuser123');

    // Step 5: Query database to verify persistence
    const retrievedCard = await SavedCard.findOne({ 
      userId: 'testuser123', 
      cardId: 'snapcaster-mage_isd' 
    });

    expect(retrievedCard).toBeTruthy();
    expect(retrievedCard?.name).toBe('Snapcaster Mage');
    expect(retrievedCard?.quantity).toBe(2);
    expect(retrievedCard?.purchasePrice).toBe(10.00);
    expect(retrievedCard?.prices).toHaveLength(1);

    // Step 6: Test querying by user
    const userCards = await SavedCard.find({ userId: 'testuser123' });
    expect(userCards).toHaveLength(1);
    expect(userCards[0].name).toBe('Snapcaster Mage');
  });

  it('should handle multiple cards for the same user', async () => {
    const cards = [
      {
        name: 'Lightning Bolt',
        setCode: 'M21',
        type: 'Instant',
        quantity: 4,
        condition: 'Near Mint' as const,
        treatment: 'Normal' as const,
        version: 'Standard',
        userId: 'player1',
        prices: []
      },
      {
        name: 'Counterspell',
        setCode: 'M21',
        type: 'Instant',
        quantity: 3,
        condition: 'Lightly Played' as const,
        treatment: 'Foil' as const,
        version: 'Standard',
        userId: 'player1',
        prices: []
      }
    ];

    // Save multiple cards
    const savedCards = await Promise.all(
      cards.map(card => saveCardToDB(card as any))
    );

    expect(savedCards).toHaveLength(2);

    // Verify both cards are saved for the user
    const userCards = await SavedCard.find({ userId: 'player1' });
    expect(userCards).toHaveLength(2);

    const cardNames = userCards.map(card => card.name).sort();
    expect(cardNames).toEqual(['Counterspell', 'Lightning Bolt']);
  });

  it('should prevent duplicate cards for the same user', async () => {
    const cardData = {
      name: 'Brainstorm',
      setCode: 'EMA',
      type: 'Instant',
      quantity: 1,
      condition: 'Near Mint' as const,
      treatment: 'Normal' as const,
      version: 'Standard',
      userId: 'player2',
      prices: []
    };

    // Save first card
    await saveCardToDB(cardData as any);

    // Try to save duplicate - should fail
    await expect(saveCardToDB(cardData as any)).rejects.toThrow();

    // Verify only one card exists
    const userCards = await SavedCard.find({ userId: 'player2' });
    expect(userCards).toHaveLength(1);
  });

  it('should allow same card for different users', async () => {
    const baseCardData = {
      name: 'Path to Exile',
      setCode: 'MM3',
      type: 'Instant',
      quantity: 1,
      condition: 'Near Mint' as const,
      treatment: 'Normal' as const,
      version: 'Standard',
      prices: []
    };

    // Save for user1
    await saveCardToDB({ ...baseCardData, userId: 'user1' } as any);

    // Save same card for user2 - should succeed
    await saveCardToDB({ ...baseCardData, userId: 'user2' } as any);

    // Verify both users have the card
    const user1Cards = await SavedCard.find({ userId: 'user1' });
    const user2Cards = await SavedCard.find({ userId: 'user2' });

    expect(user1Cards).toHaveLength(1);
    expect(user2Cards).toHaveLength(1);
    expect(user1Cards[0].name).toBe('Path to Exile');
    expect(user2Cards[0].name).toBe('Path to Exile');
  });
});