import { SearchButton } from './SearchButton'
import {
    Box,
    TextField,
} from '@mui/material'; 

interface SearchFieldProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch: () => void;
}

export function SearchField({ value, onChange, onSearch }: SearchFieldProps) {
    return (
        <Box sx={{ mb: 4 }}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search for a card..."
                value={value}
                onChange={onChange}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                InputProps={{
                    endAdornment: (
                        <SearchButton onClick={onSearch} />
                    ),
                }}
            />
        </Box>
    );
}

/**
<Box sx={{ mb: 4 }}>
    <TextField
    fullWidth
    variant="outlined"
    placeholder="Search for a card..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
    InputProps={{
    
        endAdornment: (
        <InputAdornment position="end">
            <IconButton onClick={handleSearch}>
            <SearchIcon />
            </IconButton>
        </InputAdornment>
        ),
        
    }}
    />
</Box> */