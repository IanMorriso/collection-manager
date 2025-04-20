import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import ScrapedData from '../models/ScrapedData';

export const scrapeRouter = express.Router();

scrapeRouter.post('/', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const title = $('title').text();
    const content = $('body').text();

    const scrapedData = new ScrapedData({
      url,
      title,
      content
    });

    await scrapedData.save();
    
    res.json(scrapedData);
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Failed to scrape the website' });
  }
});

scrapeRouter.get('/', async (req, res) => {
  try {
    const scrapedData = await ScrapedData.find().sort({ scrapedAt: -1 });
    res.json(scrapedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch scraped data' });
  }
});
