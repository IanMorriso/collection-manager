import {
    Card,
    CardContent,
    Typography,
    Box
} from '@mui/material';

interface CardProps {
    card: any;
}

export function CardItem({ card }: CardProps) {
    return (
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
    );
}  