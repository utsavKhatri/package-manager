import React, { useEffect, lazy, Suspense } from 'react';
import Navbar from '../components/common/Navbar';
import {
  Box,
  Container,
  IconButton,
  Pagination,
  Tooltip,
  Zoom,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, handleDeleteUser } from '../redux/asyncThunk/users';
import { setCurrentPage } from '../redux/slice/userSlice';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';

import Loader from '../components/common/Loader';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

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
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 1,
      cellClassName: 'actions',
      getActions: (values) => {
        const uniqueKey = `action-${values.row._id}`;

        return [
          <React.Fragment key={uniqueKey}>
            <EditUser userData={values.row} />
            <IconButton
              aria-describedby="delete-users"
              onClick={() => dispatch(handleDeleteUser(values.row._id))}
              key={`delete-${values.row._id}`}
              role="button"
            >
              <DeleteForeverTwoToneIcon />
            </IconButton>
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
              {role === 'admin' && <AddUser />}
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
