import React, { Suspense, lazy, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Pagination,
  Tooltip,
  Zoom,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPackages,
  handleDeletePackage,
  handleEditPackage,
} from '../redux/asyncThunk/home';
import Loader from '../components/common/Loader';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import { setCurrentPage } from '../redux/slice/homeSlice';
import { currencyFormat } from '../utils';

const CustomTable = lazy(() => import('../components/Tables/CustomTable'));
const AddPackage = lazy(() => import('../components/packages/AddPackage'));
const EditPackage = lazy(() => import('../components/packages/EditPackage'));

const Packages = () => {
  const dispatch = useDispatch();
  const { packages, packageLoading, currentPage, totalPage } = useSelector(
    (state) => state.homePage
  );

  const { role } = useSelector((state) => state.authPage);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch, currentPage]);

  const handlePaginationChange = (event, value) => {
    dispatch(setCurrentPage(value));
  };

  if (packageLoading) {
    return <Loader />;
  }

  const columns = [
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 1,
      cellClassName: 'actions',
      getActions: (values) => {
        const uniqueKey = `action-${values.row._id}`;

        return [
          <React.Fragment key={uniqueKey}>
            {role === 'superAdmin' ? (
              <IconButton
                aria-describedby="delete-package"
                onClick={async () =>
                  await dispatch(handleDeletePackage(values.row._id))
                }
                key={`delete-${values.row._id}`}
                role="button"
                aria-label='DeleteForeverTwoToneIcon'
              >
                <DeleteForeverTwoToneIcon />
              </IconButton>
            ) : (
              <>
                <EditPackage packageData={values.row} />
                <IconButton
                  aria-describedby="delete-package"
                  onClick={async () =>
                    await dispatch(handleDeletePackage(values.row._id))
                  }
                  key={`delete-${values.row._id}`}
                  role="button"
                  aria-label='DeleteForeverTwoToneIcon'
                >
                  <DeleteForeverTwoToneIcon />
                </IconButton>
              </>
            )}
          </React.Fragment>,
        ];
      },
      minWidth: 100,
      disableExport: true,
    },
    {
      field: 'name',
      headerName: 'Name',
      editable: false,
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Tooltip title={params.row.name} TransitionComponent={Zoom} arrow>
            <span>{params.row.name}</span>
          </Tooltip>
        );
      },
    },
    {
      field: 'price',
      headerName: 'Price',
      editable: false,
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return currencyFormat(params.row.price);
      },
    },

    {
      field: 'duration',
      headerName: 'Duration',
      editable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return `${params.row.duration} Days`;
      },
    },
    {
      field: 'createdBy',
      headerName: 'Created By',
      editable: false,
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        return params.row.createdBy.name;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      editable: false,
      flex: 1,
      type: 'actions',
      minWidth: 100,
      getActions: (params) => {
        const value = params.row.status ? 'Active' : 'Inactive';
        const color = [
          params.row.status ? '#d1ffc9' : '#ffc9c9',
          params.row.status ? '#8ce065' : '#e06565',
        ];
        return [
          <Chip
            key={`status-${params.row._id}`}
            mx={'auto'}
            label={value}
            component={Button}
            aria-label={value}
            aria-describedby='status'
            sx={{
              minWidth: 90,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? color[1] : color[0],
              color: 'black',
              '&:hover': {
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? color[0] : color[1],
              },
              boxShadow: (theme) => theme.shadows[1],
            }}
            variant="filled"
            onClick={() =>
              dispatch(
                handleEditPackage({
                  id: params.row._id,
                  data: {
                    status: params.row.status === true ? false : true,
                  },
                })
              )
            }
          />,
        ];
      },
      disableExport: true,
    },
  ];

  return (
    <Navbar>
      <Suspense fallback={<Loader />}>
        {packages.length === 0 ? (
          <Container>
            <h1>No Packages Found</h1>
          </Container>
        ) : (
          <Container>
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                flexDirection: {
                  xs: 'column',
                  sm: 'row',
                },
              }}
            >
              <h1>Packages</h1>
              <AddPackage />
            </Box>
            <CustomTable
              data={packages}
              columns={columns}
              key={'package-custom-table'}
              totalPages={10}
            />
            <Box mt={2} display="flex" width={'100%'} justifyContent="center">
              <Pagination
                count={totalPage}
                page={currentPage}
                onChange={handlePaginationChange}
                variant="outlined"
              />
            </Box>
          </Container>
        )}
      </Suspense>
    </Navbar>
  );
};

export default Packages;
