import express from 'express';
import axios from 'axios';

export const cardRouter = express.Router();

cardRouter.post('/', async (req, res) => {
  console.log('Received request:', req.body);


  try {
    // Current search parameters
    const { cardName, setSymbol, condition } = req.body;

    if (!cardName) {
      return res.status(400).json({ error: 'cardName is required' });
    }

    // Builds filter for query
    const filter = {
      name_eq: cardName,
      ...(setSymbol && { setCode_eq: setSymbol}), // Only takes one set symbol currently. Maybe change later?
      ...(condition && { condition_eq: condition})

    };

    // Maps filter to string for GraphQL query
    const filterString = Object.entries(filter)
      .map(([key, value]) => `${key}: "${value}"`)
      .join(', ');

    // Search query for MTGJSON API
    // - Work on adding/removing parameters later
    const query = `
      query {
        cards(
          filter: { ${filterString}},
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

    // POST request for API
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
