import React, { useState } from 'react';

import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Button,
    Divider,
    TextField,
    Chip,
    Stack
} from '@mui/material';
import { set } from 'mongoose';
import { FileDownload } from '@mui/icons-material';

interface SelectedCardProps {
    card: any,
    onUpdate?: (updatedCard: any) => void;
    onDeselect?: () => void;
}

export function SelectedCard({ card, onUpdate, onDeselect }: SelectedCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedCard, setEditedCard] = useState({
        notes: '',
        condition: card.condition || '',
        quantity: '1',
        purchasePrice: '',
    
    });

    const handleSave = () => {
        setIsEditing(false);
        if (onUpdate) {
            onUpdate(editedCard);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedCard({ ...card });
    };

    const handleFieldChange = (field: string, value: string) => {
        setEditedCard(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <Card sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
            <CardContent>
                {/* Card Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" component="h2">
                        {card.name}
                    </Typography>
                    <Box>
                        {!isEditing ? (
                            <Button 
                                variant="outlined" 
                                onClick={() => setIsEditing(true)}
                                sx={{ mr: 1 }}
                            >
                                Edit
                            </Button>
                        ) : (
                            <Stack direction="row" spacing={1}>
                                <Button 
                                    variant="contained" 
                                    onClick={handleSave}
                                    size="small"
                                >
                                    Save
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    onClick={handleCancel}
                                    size="small"
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        )}
                        {onDeselect && (
                            <Button 
                                variant="text" 
                                onClick={onDeselect}
                                color="secondary"
                            >
                                Deselect
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Original Card Info */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{xs:6}}>
                        <Typography variant="body2" color="textSecondary">
                            <strong>Set:</strong> {card.setCode}
                        </Typography>
                    </Grid>
                    <Grid size={{xs:6}}>
                        <Typography variant="body2" color="textSecondary">
                            <strong>Type:</strong> {card.type}
                        </Typography>
                    </Grid>
                    <Grid size={{xs:6}}>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Text:</strong> {card.text}
                        </Typography>
                    </Grid>
                    {card.prices && card.prices.length > 0 && (
                        <Grid size={{xs:6}}>
                            <Typography variant="body2" color="textSecondary">
                                <strong>Market Price:</strong> ${card.prices[0].price} ({card.prices[0].provider})
                            </Typography>
                        </Grid>
                    )}
                </Grid>

                <Divider sx={{ mb: 3 }} />

                {/* Additional Information Fields */}
                <Typography variant="h6" gutterBottom>
                    Personal Information
                </Typography>

                <Grid container spacing={2}>
                    {/* Notes */}
                    <Grid size={{xs:12}}>
                        <TextField
                            fullWidth
                            label="Notes"
                            multiline
                            rows={3}
                            value={editedCard.notes}
                            onChange={(e) => handleFieldChange('notes', e.target.value)}
                            disabled={!isEditing}
                            placeholder="Add personal notes about this card..."
                        />
                    </Grid>


                    {/* Condition */}
                    <Grid size={{xs:12}}>
                        <TextField
                            fullWidth
                            label="Condition"
                            value={editedCard.condition}
                            onChange={(e) => handleFieldChange('condition', e.target.value)}
                            disabled={!isEditing}
                            placeholder="NM, LP, MP, HP, DMG"
                        />
                    </Grid>

                    {/* Quantity */}
                    <Grid size={{xs:12}}>
                        <TextField
                            fullWidth
                            label="Quantity"
                            type="number"
                            inputProps={{ min: 1 }}
                            value={editedCard.quantity}
                            onChange={(e) => handleFieldChange('quantity', e.target.value)}
                            disabled={!isEditing}
                        />
                    </Grid>

                    {/* Purchase Price */}
                    <Grid size={{xs:12}}>
                        <TextField
                            fullWidth
                            label="Purchase Price"
                            type="number"
                            inputProps={{ min: 0, step: 0.01 }}
                            value={editedCard.purchasePrice}
                            onChange={(e) => handleFieldChange('purchasePrice', e.target.value)}
                            disabled={!isEditing}
                            placeholder="0.00"
                        />
                    </Grid>

                    {/* Purchase Date 
                    <Grid size={{xs:12}}>
                        <TextField
                            fullWidth
                            label="Purchase Date"
                            type="date"
                            value={editedCard.purchaseDate}
                            onChange={(e) => handleFieldChange('purchaseDate', e.target.value)}
                            disabled={!isEditing}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>*/}

                    {/* Tags 
                    <Grid size={{xs:12}}>
                        <TextField
                            fullWidth
                            label="Tags"
                            value={editedCard.tags.join(', ')}
                            onChange={(e) => handleFieldChange('tags', e.target.value.split(', ').filter(tag => tag.trim()))}
                            disabled={!isEditing}
                            placeholder="deck, favorite, trade, etc."
                            helperText="Separate tags with commas"
                        />
                        {editedCard.tags.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                                {editedCard.tags.map((tag, index) => (
                                    <Chip 
                                        key={index} 
                                        label={tag} 
                                        size="small" 
                                        sx={{ mr: 1, mb: 1 }}
                                        color="primary"
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        )}
                    </Grid> */}
                </Grid>
            </CardContent>
        </Card>
    );
}