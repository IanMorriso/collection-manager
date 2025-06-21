import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Container,
  Typography,
} from '@mui/material';
import { CardGrid } from './components/CardGrid';
import { SearchField } from './components/SearchField';


function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cards, setCards] = useState<any[]>([]);

  const handleSearch = async () => {
    console.log('Searching for:', searchQuery);
    try {
      const response = await fetch('http://localhost:3001/api/card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cardName: searchQuery
        })
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
        />
        <CardGrid cards={cards} />
      </Container>
    </Box>
  );
}

export default App;
