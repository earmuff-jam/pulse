import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import { BUILD_TABLE_CONSTANTS } from '../constants';
import { EmptyComponent } from '@utils/utils';

const SelectedRowItem = ({ selectedRow, columns }) => {
  if (Object.keys(selectedRow).length === 0) {
    return <EmptyComponent />;
  }

  return (
    <Table>
      <TableBody>
        {BUILD_TABLE_CONSTANTS(columns)(selectedRow).map((row) => (
          <TableRow key={row.label}>
            <TableCell>{row.id}</TableCell>
            <TableCell>{row.label}</TableCell>
            <TableCell>{row.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SelectedRowItem;
