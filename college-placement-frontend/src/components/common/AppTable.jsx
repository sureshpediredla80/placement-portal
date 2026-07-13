import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Box,
} from "@mui/material";
import AppEmptyState from "./AppEmptyState";

/**
 * AppTable — reusable data table.
 *
 * @param {Array}   columns   - [{ id, label, align?, width?, render? }]
 * @param {Array}   rows      - array of data objects
 * @param {string}  rowKey    - key field to use as React key (default: "id")
 * @param {boolean} isLoading - shows skeleton rows when true
 * @param {number}  skeletonRows - number of skeleton rows (default: 5)
 * @param {string}  emptyMessage - message shown when no rows
 */
const AppTable = ({
  columns = [],
  rows = [],
  rowKey = "id",
  isLoading = false,
  skeletonRows = 5,
  emptyMessage = "No records found.",
}) => {
  return (
    <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table size="small">
        {/* Head */}
        <TableHead>
          <TableRow sx={{ bgcolor: "grey.50" }}>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                align={col.align || "left"}
                sx={{ fontWeight: 700, width: col.width, whiteSpace: "nowrap" }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* Body */}
        <TableBody>
          {isLoading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    <Skeleton variant="text" width="80%" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                <AppEmptyState message={emptyMessage} />
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={row[rowKey]}
                hover
                sx={{ "&:last-child td": { border: 0 } }}
              >
                {columns.map((col) => (
                  <TableCell key={col.id} align={col.align || "left"}>
                    {col.render ? col.render(row[col.id], row) : row[col.id] ?? "—"}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AppTable;
