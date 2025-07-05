import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Container,
  Typography,
} from '@mui/material';
import { CardGrid } from './components/CardGrid';
import { SearchField } from './components/SearchField';
import { set } from 'mongoose';


function App() {
  //const [searchQuery, setSearchQuery] = useState('');
  const [cardName, setCardName] = useState('');
  const [setSymbol, setSetSymbol] = useState('');
  const [condition, setCondition] = useState('');

  const [cards, setCards] = useState<any[]>([]);

  const handleSearch = async () => {
    // Only setting query to cardName for now
    // Need to add setSymbol, etc...
    //setSearchQuery(cardName);
    console.log('Searching for:', cardName);
    try {
      const requestBody = {
        ...(cardName.trim() && { cardName }),
        ...(setSymbol.trim() && { setSymbol }),
        ...(condition.trim() && { condition })
      }
      const response = await fetch('http://localhost:3001/api/card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      setCards(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching card data:', error);
    }
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

      <Container>
        <SearchField
          value={cardName}
          parameter="cardName"
          onChange={(e) => setCardName(e.target.value)}
          onSearch={handleSearch}
          showButton={true}
        />
        <SearchField
          value={setSymbol}
          parameter="setSymbol"
          placeholder="Set symbol, e.g., 'KLD'"
          onChange={(e) => setSetSymbol(e.target.value)}
        />
       
        {/* 
       <SearchField
          value={condition}
          parameter="condition"
          placeholder="Condition, e.g., 'NM'"
          onChange={(e) => setCondition(e.target.value)}
        />*/}
      </Container>
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">Search Results</Typography>
        <CardGrid cards={cards} />
      </Container>
    </Box>
  );
}

export default App;
