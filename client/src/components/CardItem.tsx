import {
    Card,
    CardContent,
    Typography,
    Box,
    CardActionArea
} from '@mui/material';

interface CardProps {
    card: any;
    onSelect?: (card: any) => void;
}

export function CardItem({ card, onSelect }: CardProps) {
    const handleClick = () => {
        if (onSelect) {
            onSelect(card);
        }
    };

    return (
        <Card sx={{ 
            height: '100%',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
            }
        }}>
            <CardActionArea onClick={handleClick} sx={{ height: '100%' }}>
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
            </CardActionArea>
        </Card>
    );
}  