# Trading Card Manager

A Trading Card Manager application built with TypeScript, React, and MongoDB.

## Features
- Third-Party API for card data collection
- React frontend for managing scraping tasks
- MongoDB for storing scraped data
- RESTful API with Express

## Setup
1. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   ```
2. Create a `.env` file in the root directory with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=3001
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Structure
- `/client` - React frontend
- `/src/server` - Express backend
- `/src/models` - MongoDB models
- `/src/routes` - API routes
