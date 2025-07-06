import express from 'express';
import axios from 'axios';

import CardData, { ICardData } from '../models/CardData';

export const fetchCardsFromAPI = async (filters: any): Promise<ICardData[]> => {
    console.log('Received request:', filters);

    // Current search parameters
    const { cardName, setSymbol, isFoil, isAlternative, isFullArt, frameEffects, frameVersion, condition } = filters;

    if (!cardName) {
        throw new Error('cardName is required');
    }

    // Builds filter for query
    const filter = {
        name_eq: cardName,
        ...(setSymbol && { setCode_eq: setSymbol}), // Only takes one set symbol currently. Maybe change later?
        ...(condition && { condition_eq: condition}),
        ...(isFoil && { isFoil: isFoil }),
        ...(isAlternative && { isAlternative: isAlternative }),
        ...(isFullArt && { isFullArt: isFullArt }),
        ...(frameEffects && { frameEffects: frameEffects }),
        ...(frameVersion && { frameVersion: frameVersion })
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

    return response.data?.data?.cards || [];
};

export const saveCardToDB = async (cardData: ICardData): Promise<ICardData> => {
    const card = new CardData(cardData);
    return await card.save();
};

