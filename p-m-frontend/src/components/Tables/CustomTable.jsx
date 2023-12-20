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
        borderRadius: '12px',
        boxShadow:
          'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
        overflow: 'auto',
        width: '100%',
        border: 'none',
        borderStyle: 'none',
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
              <GridToolbarContainer
                sx={{
                  width: '100%',
                  justifyContent: 'flex-end',
                  display: 'flex',
                }}
              >
                <CustomMenuComp />
              </GridToolbarContainer>
            ),
          }}
          sx={{
            borderRadius: '12px',
            '& .MuiDataGrid-root': {
              backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? '#FFFFFF' : '#1E1E1E',
              padding: 1,
              border: 'none',
              borderRadius: '12px',
              borderStyle: 'none',
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
              '& .MuiDataGrid-virtualScroller': {
                '&::-webkit-scrollbar': {
                  width: '2px',
                  height: '7px',
                },
                '&::-webkit-scrollbar-track': {
                  border: 'none',
                  background: (theme) =>
                    theme.palette.mode === 'light' ? '#FFFFFF' : '#1E1E1E',
                },
                '&::-webkit-scrollbar-thumb': {
                  display: 'none',
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light' ? '#e8e8e8' : '#2D2D2D',
                  borderRadius: '8px',
                  transition: 'all 0.5s ease',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  display: 'block',
                  background: (theme) =>
                    theme.palette.mode === 'light' ? '#d3d3d3' : '#555',
                },
              },
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
              fontSize: (theme) =>
                theme.breakpoints.up('sm') ? '16px' : '14px',
              fontWeight: '400',
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
