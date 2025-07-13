import express from 'express';
import axios from 'axios';

import CardData, { ICardData } from '../models/CardData';

// Simple in-memory cache to prevent duplicate API calls
const cache = new Map<string, { data: ICardData[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Rate limiting
const rateLimitMap = new Map<string, number[]>();
const MAX_REQUESTS_PER_MINUTE = 5;

// Request counter for debugging
let requestCounter = 0;

const isRateLimited = (clientId: string = 'default'): boolean => {
    const now = Date.now();
    const requests = rateLimitMap.get(clientId) || [];
    
    // Remove requests older than 1 minute
    const recentRequests = requests.filter(time => now - time < 60000);
    
    if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
        return true;
    }
    
    // Add current request
    recentRequests.push(now);
    rateLimitMap.set(clientId, recentRequests);
    
    return false;
};

export const fetchCardsFromAPI = async (filters: any): Promise<ICardData[]> => {
    requestCounter++;
    console.log(`API Request #${requestCounter} - Received request:`, filters);

    // Rate limiting check
    if (isRateLimited()) {
        console.log('Rate limited - too many requests');
        throw new Error('Rate limit exceeded. Please wait before making another request.');
    }

    // Current search parameters
    const { cardName, setSymbol, isFoil, isAlternative, isFullArt, frameEffects, frameVersion, condition } = filters;

    if (!cardName) {
        throw new Error('cardName is required');
    }

    // Create cache key
    const cacheKey = JSON.stringify(filters);
    const cachedResult = cache.get(cacheKey);
    
    // Check cache first
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
        console.log('Returning cached result for:', cacheKey);
        return cachedResult.data;
    }

    console.log('Making API request for:', cacheKey);

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

    const cards = response.data?.data?.cards || [];
    
    // Cache the result
    cache.set(cacheKey, { data: cards, timestamp: Date.now() });
    
    // Clean up old cache entries
    if (cache.size > 100) {
        const entries = Array.from(cache.entries());
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
        const oldestKey = entries[0][0];
        cache.delete(oldestKey);
    }

    return cards;
};

export const saveCardToDB = async (cardData: ICardData): Promise<ICardData> => {
    const card = new CardData(cardData);
    return await card.save();
};

