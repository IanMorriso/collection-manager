import { CardItem } from './CardItem'
import { Grid } from '@mui/material';

interface CardGridProps {
    cards: any[];
    selectedCard?: any;
    onCardSelect: (card: any) => void;
}

//const [selectedCard, setSelectedCard] = useState<any>(null);

export function CardGrid({ cards, selectedCard, onCardSelect }: CardGridProps) {
    return (
        <Grid container spacing={3}>
            {cards.map((card, index) => (
                <Grid size={{xs:12, sm:6, md:4}} key={index}>
                    <CardItem 
                        card={card}
                        key={index}
                        isSelected={card === selectedCard} 
                        onSelect={onCardSelect} 
                    />
                </Grid>
            ))}
        </Grid>
    );
}