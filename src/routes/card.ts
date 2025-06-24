import express from 'express';
import axios from 'axios';

export const cardRouter = express.Router();

cardRouter.post('/', async (req, res) => {
  console.log('Received request:', req.body);
  try {
    const { cardName, setSymbol } = req.body;

    if (!cardName) {
      return res.status(400).json({ error: 'cardName is required' });
    }

    const query = `
      query {
        cards(
          filter: { name_eq: "${cardName}", setCode_eq: "${setSymbol}"},
          page: { take: 100, skip: 0 }
          order: { order: ASC }
        ) {
          name
          setCode
          type
          text
          prices {
            provider
            date
            cardType
            listType
            price
          }
        }
      }
    `;

    const response = await axios.post(
      'https://graphql.mtgjson.com/',
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    console.log('API response:', response.data);

    const cards = response.data?.data?.cards || [];
    res.json(cards);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to fetch card data' });
  }
});

cardRouter.get('/', async (req, res) => {
  res.status(501).json({ error: 'Not implemented: use POST to search for cards.' });
});
