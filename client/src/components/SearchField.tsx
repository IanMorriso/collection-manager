
import { SearchButton } from './SearchButton'
import {
    Box,
    TextField
} from '@mui/material'; 

interface SearchFieldProps {
    value: string;
    placeholder?: string;
    parameter: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch?: () => void;
    showButton?: boolean;
}

export function SearchField({ value, placeholder, onChange, onSearch, showButton }: SearchFieldProps) {
    return (
        <Box sx={{ mb: 4 }}>
            
            <TextField
                fullWidth
                placeholder={placeholder || "Search for a card..."}
                value={value}
                onChange={onChange}
                onKeyDown={showButton ? (e) => e.key === 'Enter' && onSearch && onSearch() : undefined}
                InputProps={{
                    endAdornment: showButton && onSearch ?(
                        <SearchButton onClick={onSearch} />
                    ) : undefined,
                }}
            />
        </Box>
    );
}
