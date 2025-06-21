
import { IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchButtonProps {
  onClick: () => void;
}

export function SearchButton({ onClick }: SearchButtonProps) {
  return (
    <InputAdornment position="end">
      <IconButton onClick={onClick}>
        <SearchIcon />
      </IconButton>
    </InputAdornment>
  );
}