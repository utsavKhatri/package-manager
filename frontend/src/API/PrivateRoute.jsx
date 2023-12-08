import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.authPage);
  const user = JSON.parse(localStorage.getItem('user'));

  return user?.token !== null && isAuthenticated === true ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
