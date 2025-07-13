import {
    Card,
    CardContent,
    Typography,
    Box
} from '@mui/material';

interface CardProps {
    card: any;
    key: string | number;
    isSelected?: boolean;
    onSelect: (card: any) => void;
}

export function CardItem({ card, key, isSelected = false, onSelect }: CardProps) {
    return (
        <Card
            onClick={() => onSelect(card)}
            sx={{
                '&:hover': {
                    ...(!isSelected && {
                        boxShadow: 8,
                        transform: 'scale(1.02)',
                        backgroundColor: 'action.hover',
                        borderColor: 'primary.main',
                        border: '1px solid',
                    }),
                    cursor: 'pointer'
                },
                transition: 'all 0.3s ease-in-out',
                border: isSelected ? '2px solid' : '1px solid transparent',
                borderColor: isSelected ? 'primary.main' : 'transparent',
                backgroundColor: isSelected ? 'primary.light' : 'background.paper',
                opacity: isSelected ? 1 : 0.9,
            }}>
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
    );
}  