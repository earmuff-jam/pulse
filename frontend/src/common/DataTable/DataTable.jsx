import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { EmptyComponent } from '@utils/utils';

export default function DataTable({ rows, columns, isEmpty, subtitle }) {
  if (isEmpty) {
    return <EmptyComponent subtitle={subtitle} />;
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'table',
        tableLayout: 'fixed',
        height: '10rem',
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </Box>
  );
}
