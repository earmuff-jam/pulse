import {
  Checkbox,
  IconButton,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  Box,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { EditRounded, FileOpenRounded } from '@mui/icons-material';
import { EmptyComponent } from '../../utils/utils';

/**
 * TableComponent React Function - Displays the inventory table
 * @param {boolean} hideActionMenu - determines if extra functionality should be present, like selection of rows, defaults: false
 * @param {boolean} hideCheckBox - determines if associated icons should be present, defaults: false
 * @param {boolean} hideIconButton - determines if associated icons should be present, defaults: false
 * @param {boolean} hideMoreDetailsButton - determines if associated icons should be present, defaults: false
 * @param {boolean} isLoading - determines if the selected data is still in loading state
 * @param {Array<Object>} columns - the columns to display for the table
 * @param {Function} rowFormatter - the row formatter to format each row
 * @param {Array<Object>} data - the data to display for each row in the table
 * @param {Array<String>} rowSelected - the array of IDs that represent each item
 * @param {Function} onRowSelect - the function that is used to select a specific row
 * @param {Function} handleRowSelection - the function that is used to handle selection of rows
 * @param {Function} handleEdit - the function that is used to handle editing capabilities
 * @param {boolean} emptyComponentSubtext - subtitle text to display when there is no selected rows, defaults: empty string
 * @param {string} maxHeight - the maxHeight of the table container, defaults: 65vh
 */
const TableComponent = ({
  hideActionMenu = false,
  hideCheckBox = false,
  hideIconButton = false,
  hideMoreDetailsButton = false,
  isLoading,
  columns,
  data,
  rowFormatter,
  rowSelected,
  onRowSelect,
  handleRowSelection,
  handleEdit,
  emptyComponentSubtext = '',
}) => {
  if (isLoading) return <Skeleton height="10vh" />;

  if (!data || data.length === 0) {
    return <EmptyComponent subtitle={emptyComponentSubtext} />;
  }

  return (
    <Box sx={{ width: '100%', display: 'table', tableLayout: 'fixed', border: '1px solid #ddd', borderRadius: '4px' }}>
      <Table>
        <TableHead>
          <TableRow>
            {!hideActionMenu ? (
              <TableCell>
                <Stack direction="row" alignItems="center">
                  <Checkbox size="small" onClick={(ev) => handleRowSelection(ev, 'all')} />
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={'bold'}>
                    Action
                  </Typography>
                </Stack>
              </TableCell>
            ) : null}
            {Object.keys(columns).map((colKey) => {
              const column = columns[colKey];
              return (
                <TableCell key={column.id}>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={'bold'}>
                    {column.label}
                  </Typography>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => {
            const isSelected = (id) => rowSelected.indexOf(id) !== -1;
            const selectedID = row.id;
            const isItemSelected = isSelected(selectedID);
            return (
              <TableRow hover key={row.id}>
                {!hideActionMenu && (
                  <TableCell size="small">
                    <Stack direction="row" spacing={1}>
                      {!hideCheckBox && (
                        <Checkbox
                          checked={isItemSelected}
                          color="primary"
                          size="small"
                          onClick={(event) => handleRowSelection(event, selectedID)}
                          inputProps={{ 'aria-labelledby': 'labelId' }}
                        />
                      )}
                      {!hideIconButton && (
                        <IconButton onClick={() => handleEdit(selectedID)} size="small">
                          <EditRounded color="primary" fontSize="small" />
                        </IconButton>
                      )}
                      {!hideMoreDetailsButton && (
                        <IconButton size="small" onClick={() => onRowSelect(row)}>
                          <FileOpenRounded color="primary" fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>
                  </TableCell>
                )}
                {Object.keys(columns).map((colKey) => {
                  const column = columns[colKey];
                  return (
                    <TableCell key={column.id} size="small">
                      {rowFormatter(row, column.colName, column)}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
};

export default TableComponent;
