import { Box, Pagination, Typography, Select, MenuItem, FormControl } from "@mui/material";

/**
 * AppPagination — reusable pagination bar.
 *
 * @param {number} page          - current page (1-indexed for MUI Pagination)
 * @param {number} totalPages    - total page count
 * @param {number} totalElements - total record count
 * @param {number} size          - page size
 * @param {Function} onPageChange  - called with new page (1-indexed)
 * @param {Function} onSizeChange  - called with new size
 * @param {number[]} sizeOptions  - available page sizes
 */
const AppPagination = ({
  page = 1,
  totalPages = 1,
  totalElements = 0,
  size = 10,
  onPageChange,
  onSizeChange,
  sizeOptions = [5, 10, 25, 50],
}) => {
  if (totalPages <= 0) return null;

  const from = totalElements === 0 ? 0 : (page - 1) * size + 1;
  const to = Math.min(page * size, totalElements);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 1,
        mt: 2,
        px: 1,
      }}
    >
      {/* Record count info */}
      <Typography variant="body2" color="text.secondary">
        Showing {from}–{to} of {totalElements} records
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Rows per page */}
        {onSizeChange && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Rows per page:
            </Typography>
            <FormControl size="small" variant="outlined">
              <Select
                value={size}
                onChange={(e) => onSizeChange(Number(e.target.value))}
                sx={{ fontSize: 14 }}
              >
                {sizeOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Page navigation */}
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, newPage) => onPageChange?.(newPage)}
          color="primary"
          shape="rounded"
          size="small"
        />
      </Box>
    </Box>
  );
};

export default AppPagination;
