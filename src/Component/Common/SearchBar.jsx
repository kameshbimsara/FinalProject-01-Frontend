import { TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  fullWidth = true,
  sx = {},
}) {
  return (
    <TextField
      fullWidth={fullWidth}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ mb: 3, ...sx }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
    />
  );
}
