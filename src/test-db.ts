import mongoose from 'mongoose';

async function testConnection() {
    try {
        await mongoose.connect('mongodb://localhost:27017/web-scraper');
        console.log('Successfully connected to MongoDB.');
        
        // Create a simple test collection
        const Test = mongoose.model('Test', new mongoose.Schema({
            name: String,
            timestamp: { type: Date, default: Date.now }
        }));

        // Insert a test document
        const testDoc = await Test.create({ name: 'test-connection' });
        console.log('Created test document:', testDoc);

        // Read it back
        const found = await Test.findById(testDoc._id);
        console.log('Found test document:', found);

        // Clean up
        await Test.deleteMany({});
        console.log('Cleaned up test documents');

        await mongoose.connection.close();
        console.log('Connection closed successfully.');
    } catch (error) {
        console.error('MongoDB connection test failed:', error);
    }
}

testConnection();
