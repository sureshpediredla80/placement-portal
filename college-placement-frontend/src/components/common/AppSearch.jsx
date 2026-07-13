import { useState } from "react";
import { InputAdornment, TextField, IconButton } from "@mui/material";
import { Search, Clear } from "@mui/icons-material";

/**
 * AppSearch — debounced search input.
 *
 * @param {string}   value       - controlled value
 * @param {Function} onChange    - called with new string value
 * @param {string}   placeholder
 * @param {string}   size        - "small" | "medium"
 */
const AppSearch = ({
  value,
  onChange,
  placeholder = "Search...",
  size = "small",
  sx = {},
}) => {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      size={size}
      sx={{ minWidth: 240, ...sx }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search fontSize="small" color="action" />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton size="small" onClick={() => onChange("")}>
              <Clear fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
};

export default AppSearch;
