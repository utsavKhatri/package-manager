import { lazy } from 'react';
import Paper from '@mui/material/Paper';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { useTheme } from '@mui/material';
import '../../App.css';

const CustomMenuComp = lazy(() => import('./CustomMenuComp'));

const CustomTable = ({ data, columns, totalPages }) => {
  const theme = useTheme();
  return (
    <Paper
      variant={theme.palette.mode === 'dark' ? 'outlined' : 'elevation'}
      sx={{
        borderColor: theme.palette.mode === 'dark' ? '#555' : '#ccc',
        borderRadius: '16px',
        boxShadow:
          'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
        overflow: 'auto',
        width: '100%',
        borderBottom: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
      elevation={theme.palette.mode === 'dark' ? 0 : 3}
    >
      {data ? (
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: false,
            sorting: { sortModel: [{ field: 'updatedAt', sort: 'desc' }] },
          }}
          progressComponent={
            <ScaleLoader
              color={theme.palette.mode === 'light' ? '#000000' : '#ffffff'}
            />
          }
          rowCount={totalPages}
          paginationMode="server"
          slots={{
            toolbar: () => (
              <GridToolbarContainer sx={{ marginLeft: 'auto' }}>
                <CustomMenuComp />
              </GridToolbarContainer>
            ),
          }}
          sx={{
            '& .MuiDataGrid-root': {
              backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? '#FFFFFF' : '#1E1E1E',
              borderRadius: '8px',
              padding: 1,
              border: 'none',
              boxShadow: (theme) =>
                theme.palette.mode === 'light'
                  ? '0 2px 4px rgba(0, 0, 0, 0.1)'
                  : '0 2px 4px rgba(255, 255, 255, 0.1)',
            },
            '& .MuiDataGrid-main': {
              color: (theme) =>
                theme.palette.mode === 'light' ? '#333333' : '#FFFFFF',
              backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? '#FFFFFF' : '#1E1E1E',
              width: '100%',
              margin: 0,
              padding: 0,
              overflow: 'hidden',
            },
            '& .MuiDataGrid-toolbarContainer': {
              paddingBottom: '8px',
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(180deg, rgb(0 0 0 / 50%) 0%, rgb(30 30 30) 100%)'
                  : 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%)',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid',
              borderBottomColor: (theme) =>
                theme.palette.mode === 'light' ? '#EEEEEE' : '#333333',
              padding: '12px',
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light' ? '#F5F5F5' : '#333333',
              },
            },
            '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
              fontSize: '14px',
              fontWeight: '500',
            },
            overflow: 'auto',
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? '#BBBBBB' : '#666666',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
              borderRadius: '4px',
            },
            '@media print': {
              '.MuiDataGrid-main': {
                color: (theme) =>
                  theme.palette.mode === 'light' ? '#333333' : '#FFFFFF',
                width: '100%',
                margin: 0,
                padding: 0,
              },
            },
          }}
          hideFooter
          disableRowSelectionOnClick
          slotProps={{
            toolbar: {
              printOptions: {
                pageStyle:
                  '.MuiDataGrid-root .MuiDataGrid-main { color: black; }',
              },
            },
          }}
        />
      ) : (
        <ScaleLoader
          color={theme.palette.mode === 'light' ? '#000000' : '#ffffff'}
        />
      )}
    </Paper>
  );
};

export default CustomTable;
