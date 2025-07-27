import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Container,
  Typography,
} from '@mui/material';
import { CardGrid } from './components/CardGrid';
import { SearchField } from './components/SearchField';
import { CardModal } from './components/CardModal';

import { saveCardToCollection } from './services/cardService';
import { searchCards } from './services/cardService';


function App() {
  //const [searchQuery, setSearchQuery] = useState('');
  const [cardName, setCardName] = useState('');
  const [setSymbol, setSetSymbol] = useState('');
  const [condition, setCondition] = useState('');

  const [cards, setCards] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchParams, setLastSearchParams] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [saving, setIsSaving] = useState(false);

  const handleSearch = async () => {
    if (isSearching) {
      console.log('Search already in progress, skipping...');
      return;
    }
  
    /**
    const searchParams = {
      cardName: cardName.trim(),
      setSymbol: setSymbol.trim(),
      condition: condition.trim()
    };
  */

  

  

    
    try {
      const requestBody = {
        ...(cardName.trim() && { cardName }),
        ...(setSymbol.trim() && { setSymbol }),
        ...(condition.trim() && { condition })
      };
      const searchParamsString = JSON.stringify(requestBody);

      if (searchParamsString === lastSearchParams) {
        console.log('Duplicate search detected, skipping...');
        return;
      }
      console.log('Searching for:', cardName);
      setIsSearching(true);
  
      const data = await searchCards(requestBody);
      setCards(Array.isArray(data) ? data : []);
      setLastSearchParams(searchParamsString);
      
    } catch (error) {
      console.error('Error fetching card data:', error);
      setCards([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveCard = async (cardData: any) => {
    try{
      setIsSaving(true);
      await saveCardToCollection(cardData)
      setSelectedCard(null);
      console.log("Card saved sucessfully")
    } catch (error) {
      console.error("Failed to save card!", error);
    } finally {
      setIsSaving(false);
    }
  }

  const handleCardSelect = (card: any) => {
    setSelectedCard(card);
  };

  const handleCardClose = () => {
    setSelectedCard(null);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Container>
          <Typography variant="h4" component="h1" sx={{ py: 2 }}>
            Collection Manager
          </Typography>
        </Container>
      </AppBar>

      {/* Container for search fields */}
      <Container>
        <SearchField
          value={cardName}
          parameter="cardName"
          onChange={(e) => setCardName(e.target.value)}
          onSearch={handleSearch}
          showButton={true}
          disabled={isSearching}
        />
        <SearchField
          value={setSymbol}
          parameter="setSymbol"
          placeholder="Set symbol, e.g., 'KLD'"
          onChange={(e) => setSetSymbol(e.target.value)}
        />       
       <SearchField
          value={condition}
          parameter="condition"
          placeholder="Condition, e.g., 'NM'"
          onChange={(e) => setCondition(e.target.value)}
        />
      </Container>

      {/* Container for search results */}
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">Search Results</Typography>
        <CardGrid cards={cards} onCardSelect={handleCardSelect} />
      </Container>

      {/* Card Selection Modal */}
      <CardModal 
        card={selectedCard}
        open={!!selectedCard}
        onClose={handleCardClose}
        onSave={handleSaveCard}
      />

    </Box>
  );
}

export default App;
