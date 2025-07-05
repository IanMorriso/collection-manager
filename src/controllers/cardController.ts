import { Request, Response } from 'express';
import { fetchCardsFromAPI, saveCardToDB } from '../services/cardService';

export const getCards = async (req: Request, res: Response) => {
    try {
        const cards = await fetchCardsFromAPI(req.body);
        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cards' });
    }
};

export const createCard = async (req: Request, res: Response) => {
    try {
        const card = await saveCardToDB(req.body);
        res.status(201).json(card);
    } catch (error) {
        console.error('Error saving card:', error);
        res.status(500).json({ error: 'Failed to save card' });
    }
};