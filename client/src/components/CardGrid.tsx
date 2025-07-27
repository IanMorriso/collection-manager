import { CardItem } from './CardItem'
import { Grid } from '@mui/material';

interface CardGridProps {
    cards: any[];
    onCardSelect?: (card: any) => void;
}

export function CardGrid({ cards, onCardSelect }: CardGridProps) {
    return (
        <Grid container spacing={3}>
            {cards.map((card, index) => (
                <Grid size={{xs:12, sm:6, md:4}} key={index}>
                    <CardItem card={card} onSelect={onCardSelect} />
                </Grid>
            ))}
        </Grid>
    );
}