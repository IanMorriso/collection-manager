import mongoose from 'mongoose';
import SavedCard from './src/models/SavedCard';

async function testSaveCard() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/card-db');
        console.log('Connected to MongoDB');

        // Create a test card
        const testCard = {
            name: 'Lightning Bolt',
            setCode: 'M21',
            type: 'Instant',
            text: 'Lightning Bolt deals 3 damage to any target.',
            prices: [{
                provider: 'tcgplayer',
                date: new Date(),
                cardType: 'normal',
                listType: 'market',
                price: 0.25
            }],
            quantity: 1,
            condition: 'Near Mint',
            treatment: 'Normal',
            version: 'Standard'
        };

        console.log('Creating card with data:', testCard);

        // Save the card
        const savedCard = new SavedCard(testCard);
        const result = await savedCard.save();

        console.log('Card saved successfully:', result);

        // Query it back
        const foundCard = await SavedCard.findById(result._id);
        console.log('Found card:', foundCard);

        // Clean up
        await SavedCard.deleteOne({ _id: result._id });
        console.log('Test card deleted');

        await mongoose.connection.close();
        console.log('Connection closed');

    } catch (error) {
        console.error('Error testing save card:', error);
        await mongoose.connection.close();
    }
}

testSaveCard();