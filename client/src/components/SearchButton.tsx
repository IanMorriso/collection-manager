
import { IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function SearchButton({ onClick, disabled }: SearchButtonProps) {
  return (
    <InputAdornment position="end">
      <IconButton onClick={onClick} disabled={disabled}>
        <SearchIcon />
      </IconButton>
    </InputAdornment>
  );
}