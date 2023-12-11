import React, { useEffect, lazy, Suspense } from 'react';
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
  fetchUsers,
  handleDeleteUser,
  handleEditUser,
} from '../redux/asyncThunk/users';
import { setCurrentPage } from '../redux/slice/userSlice';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

import Navbar from '../components/common/Navbar';
import Loader from '../components/common/Loader';

const EditUser = lazy(() => import('../components/users/EditUser'));
const AddUser = lazy(() => import('../components/users/AddUser'));
const CustomTable = lazy(() => import('../components/Tables/CustomTable'));

const UsersPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { users, usersLoading, currentPage, totalPage } = useSelector(
    (state) => state.userPage
  );
  const { role } = useSelector((state) => state.authPage);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const successMessage = searchParams.get('success');

    if (successMessage) {
      toast.success(successMessage, { duration: 5000 });
      searchParams.delete('success');
    }
    dispatch(fetchUsers());
  }, [dispatch, currentPage, location.search]);

  const handlePaginationChange = (event, value) => {
    dispatch(setCurrentPage(value));
  };

  if (usersLoading) {
    return <Loader />;
  }

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      editable: false,
      flex: 1,
      minWidth: 125,
      renderCell: (params) => {
        return (
          <Tooltip title={params.row.name} TransitionComponent={Zoom} arrow>
            <span>{params.row.name}</span>
          </Tooltip>
        );
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      editable: false,
      flex: 1,
      minWidth: 175,
      renderCell: (params) => {
        return (
          <Tooltip title={params.row.email} TransitionComponent={Zoom} arrow>
            <span>{params.row.email}</span>
          </Tooltip>
        );
      },
    },
    {
      field: 'isActive',
      headerName: 'Status',
      editable: false,
      flex: 1,
      minWidth: 90,
      valueGetter: (params) => {
        return params.row.isActive ? 'Active' : 'Inactive';
      },
    },
    {
      field: 'isAdmin',
      headerName: 'Role',
      editable: false,
      flex: 1,
      minWidth: 125,
      valueGetter: (params) => {
        return params.row.isAdmin ? 'Admin' : 'Business User';
      },
    },
    {
      field: 'selfRegistration',
      headerName: 'Invited By',
      editable: false,
      flex: 1,
      minWidth: 125,
      valueGetter: (params) => {
        return params.row.selfRegistration
          ? 'Self Registration'
          : params.row.createdBy.name;
      },
    },
  ];

  if (role === 'admin' || role === 'businessUser') {
    columns.push({
      field: 'status',
      headerName: 'Status',
      editable: false,
      flex: 1,
      type: 'actions',
      minWidth: 100,
      getActions: (params) => {
        const value = params.row.isActive ? 'Active' : 'Inactive';
        const color = [
          params.row.isActive ? '#d1ffc9' : '#ffc9c9',
          params.row.isActive ? '#8ce065' : '#e06565',
        ];
        return [
          <Chip
            key={`status-${params.row._id}`}
            mx={'auto'}
            label={value}
            aria-describedby="status"
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
                handleEditUser({
                  id: params.row._id,
                  data: {
                    isActive: params.row.isActive === true ? false : true,
                  },
                })
              )
            }
          />,
        ];
      },
      disableExport: true,
    });
    columns.unshift({
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 1,
      cellClassName: 'actions',
      getActions: (values) => {
        const uniqueKey = `action-${values.row._id}`;

        return [<EditUser userData={values.row} key={uniqueKey} />];
      },
      minWidth: 100,
      disableExport: true,
    });
  }

  if (role === 'superAdmin') {
    columns.unshift({
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 1,
      cellClassName: 'actions',
      getActions: (values) => {
        return [
          <IconButton
            aria-label="DeleteForeverTwoToneIcon"
            aria-describedby="delete-users"
            onClick={() => dispatch(handleDeleteUser(values.row._id))}
            key={`delete-${values.row._id}`}
            role="button"
          >
            <DeleteForeverTwoToneIcon />
          </IconButton>,
        ];
      },
      minWidth: 100,
      disableExport: true,
    });

    const addArray = [
      {
        field: 'package',
        headerName: 'Package (name/status)',
        editable: false,
        flex: 1,
        minWidth: 170,
        valueGetter: (params) => {
          return params.row.package
            ? `${params.row.package.package.name} | ${
                params.row.package.isExpired ? 'Expired' : 'Active'
              }`
            : '-';
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
          const value = params.row.isActive ? 'Active' : 'Inactive';
          const color = [
            params.row.isActive ? '#d1ffc9' : '#ffc9c9',
            params.row.isActive ? '#8ce065' : '#e06565',
          ];
          return [
            <Chip
              key={`status-${params.row._id}`}
              mx={'auto'}
              label={value}
              component={Button}
              aria-label={value}
              aria-describedby="status"
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
                  handleEditUser({
                    id: params.row._id,
                    data: {
                      isActive: params.row.isActive === true ? false : true,
                    },
                  })
                )
              }
            />,
          ];
        },
        disableExport: true,
      },
      {
        field: 'createdBy',
        headerName: 'Created By',
        editable: false,
        flex: 1,
        minWidth: 125,
        renderCell: (params) => {
          return (
            <Tooltip
              title={params.row.createdBy ? params.row.createdBy.name : '-'}
              TransitionComponent={Zoom}
              arrow
            >
              <span>
                {params.row.createdBy ? params.row.createdBy.name : '-'}
              </span>
            </Tooltip>
          );
        },
      },
      {
        field: 'updatedBy',
        headerName: 'Updated By',
        editable: false,
        flex: 1,
        minWidth: 125,
        renderCell: (params) => {
          return (
            <Tooltip
              title={params.row.updatedBy ? params.row.updatedBy.name : '-'}
              TransitionComponent={Zoom}
              arrow
            >
              <span>
                {params.row.updatedBy ? params.row.updatedBy.name : '-'}
              </span>
            </Tooltip>
          );
        },
      },
      {
        field: 'updatedAt',
        headerName: 'Updated At',
        editable: false,
        flex: 1,
        minWidth: 125,
        valueGetter: (params) => {
          return params.row.updatedAt
            ? new Date(params.row.updatedAt).toLocaleString()
            : '-';
        },
      },
    ];

    columns.push(...addArray);
  }

  return (
    <Navbar>
      <Suspense fallback={<Loader />}>
        {users.length === 0 ? (
          <Container>
            <h1>No Users Found</h1>
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
              <h1>Users</h1>
              {role !== 'businessUser' && <AddUser />}
            </Box>
            <CustomTable
              data={users}
              columns={columns}
              key={'users-custom-table'}
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

export default UsersPage;
