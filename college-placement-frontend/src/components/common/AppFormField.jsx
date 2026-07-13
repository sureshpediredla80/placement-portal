import { Controller } from "react-hook-form";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

/**
 * AppFormField — React Hook Form controller for MUI inputs.
 *
 * @param {object}  control   - RHF control object
 * @param {string}  name      - field name
 * @param {string}  label     - field label
 * @param {string}  type      - "text" | "password" | "email" | "number" | "select" | "textarea"
 * @param {Array}   options   - [{ value, label }] for type="select"
 * @param {object}  rules     - RHF validation rules
 * @param {boolean} required
 * @param {boolean} disabled
 * @param {object}  sx
 */
const AppFormField = ({
  control,
  name,
  label,
  type = "text",
  options = [],
  rules = {},
  required = false,
  disabled = false,
  sx = {},
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => {
        if (type === "select") {
          return (
            <FormControl
              fullWidth
              error={!!error}
              disabled={disabled}
              size="small"
              sx={sx}
            >
              <InputLabel required={required}>{label}</InputLabel>
              <Select {...field} label={label}>
                {options.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          );
        }

        return (
          <TextField
            {...field}
            label={label}
            type={type}
            required={required}
            disabled={disabled}
            error={!!error}
            helperText={error?.message}
            fullWidth
            size="small"
            multiline={type === "textarea"}
            rows={type === "textarea" ? 4 : undefined}
            sx={sx}
            {...rest}
          />
        );
      }}
    />
  );
};

export default AppFormField;
