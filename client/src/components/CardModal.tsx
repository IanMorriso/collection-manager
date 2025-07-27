import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Backdrop,
  Button,
  Divider,
  Chip,
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  InputAdornment
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface CardModalProps {
  card: any;
  open: boolean;
  onClose: () => void;
  onSave?: (cardData: any) => void;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '80%', md: '60%', lg: '50%' },
  maxWidth: '600px',
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
};

export function CardModal({ card, open, onClose, onSave }: CardModalProps) {
  // Form state for collection data
  const [collectionData, setCollectionData] = useState({
    purchasePrice: '',
    targetPrice: '',
    quantity: 1,
    condition: 'Near Mint',
    treatment: 'Normal',
    version: 'Standard'
  });

  // Reset form when card changes
  useEffect(() => {
    if (card) {
      setCollectionData({
        purchasePrice: '',
        targetPrice: '',
        quantity: 1,
        condition: 'Near Mint',
        treatment: 'Normal',
        version: 'Standard'
      });
    }
  }, [card]);

  if (!card) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleInputChange = (field: string, value: any) => {
    setCollectionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveToCollection = () => {
    const cardToSave = {
      ...card,
      ...collectionData,
      purchasePrice: collectionData.purchasePrice ? parseFloat(collectionData.purchasePrice) : undefined,
      targetPrice: collectionData.targetPrice ? parseFloat(collectionData.targetPrice) : undefined
    };

    console.log('Saving card to collection:', cardToSave);
    
    if (onSave) {
      onSave(cardToSave);
    }

    onClose();
  };

  const conditionOptions = [
    'Near Mint',
    'Lightly Played',
    'Moderately Played',
    'Heavily Played',
    'Damaged'
  ];

  const treatmentOptions = [
    'Normal',
    'Foil',
    'Etched',
    'Showcase',
    'Extended Art',
    'Borderless'
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        sx: { backdropFilter: 'blur(4px)' }
      }}
    >
      <Box sx={modalStyle}>
        <Card elevation={0} sx={{ borderRadius: 2 }}>
          {/* Header with close button */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: 1,
            borderColor: 'divider'
          }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              {card.name}
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {/* Card Details */}
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Card Information
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip label={card.setCode} size="small" variant="outlined" />
                  <Chip label={card.type} size="small" variant="outlined" />
                </Stack>
              </Box>

              {/* Card Text */}
              {card.text && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Card Text:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: 'italic',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {card.text}
                  </Typography>
                </Box>
              )}

              {/* Pricing Information */}
              {card.prices && card.prices.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Price Information
                  </Typography>
                  <Stack spacing={1}>
                    {card.prices.slice(0, 5).map((price: any, index: number) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {price.provider}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {price.cardType} • {price.listType}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {formatPrice(price.price)}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {formatDate(price.date)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              <Divider />

              {/* Collection Management Form */}
              <Box>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Add to Collection
                </Typography>

                <Grid container spacing={2}>
                  {/* Quantity */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Quantity"
                      type="number"
                      value={collectionData.quantity}
                      onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                      inputProps={{ min: 1, max: 99 }}
                      size="small"
                    />
                  </Grid>

                  {/* Condition */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Condition</InputLabel>
                      <Select
                        value={collectionData.condition}
                        label="Condition"
                        onChange={(e) => handleInputChange('condition', e.target.value)}
                      >
                        {conditionOptions.map((condition) => (
                          <MenuItem key={condition} value={condition}>
                            {condition}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Treatment */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Treatment</InputLabel>
                      <Select
                        value={collectionData.treatment}
                        label="Treatment"
                        onChange={(e) => handleInputChange('treatment', e.target.value)}
                      >
                        {treatmentOptions.map((treatment) => (
                          <MenuItem key={treatment} value={treatment}>
                            {treatment}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Version */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Version"
                      value={collectionData.version}
                      onChange={(e) => handleInputChange('version', e.target.value)}
                      size="small"
                      placeholder="e.g., Standard, Promo, etc."
                    />
                  </Grid>

                  {/* Purchase Price */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Purchase Price"
                      type="number"
                      value={collectionData.purchasePrice}
                      onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      inputProps={{ min: 0, step: 0.01 }}
                      size="small"
                      placeholder="0.00"
                    />
                  </Grid>

                  {/* Target Price */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Target Price"
                      type="number"
                      value={collectionData.targetPrice}
                      onChange={(e) => handleInputChange('targetPrice', e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      inputProps={{ min: 0, step: 0.01 }}
                      size="small"
                      placeholder="0.00"
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider />

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSaveToCollection}
                >
                  Add to Collection
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={onClose}
                >
                  Close
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
}