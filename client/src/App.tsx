import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Container,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cards, setCards] = useState<any[]>([]);

  const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/scrape', {
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
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for a card..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            slotProps={{
              input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
                ),
              }
            }}
          />
        </Box>

        <Grid container spacing={3}>
          {cards.map((card, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {card.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Set: {card.setCode}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Type: {card.type}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {card.text}
                  </Typography>
                  {card.prices && card.prices.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">Latest Price:</Typography>
                      <Typography variant="body2">
                        ${card.prices[0].price} ({card.prices[0].provider})
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default App;
