
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
    disabled?: boolean;
}

export function SearchField({ value, placeholder, onChange, onSearch, showButton, disabled }: SearchFieldProps) {
    return (
        <Box sx={{ mb: 4 }}>
            
            <TextField
                fullWidth
                placeholder={placeholder || "Search for a card..."}
                value={value}
                onChange={onChange}
                disabled={disabled}
                onKeyDown={showButton ? (e) => e.key === 'Enter' && onSearch && onSearch() : undefined}
                InputProps={{
                    endAdornment: showButton && onSearch ?(
                        <SearchButton onClick={onSearch} disabled={disabled} />
                    ) : undefined,
                }}
            />
        </Box>
    );
}
