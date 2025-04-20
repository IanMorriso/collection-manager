import React, { useEffect, useState } from 'react';

interface Card {
  _id: string;
  url: string;
  title: string;
  content: string;
  scrapedAt: string;
}

export function MyCollection() {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/scrape');
        const data = await response.json();
        setCards(data);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, []);

  return (
    <div>
      <h1>My Collection</h1>
      <ul>
        {cards.map((card) => (
          <li key={card._id}>
            <h2>{card.title}</h2>
            <p>{card.content}</p>
            <small>Scraped At: {new Date(card.scrapedAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}