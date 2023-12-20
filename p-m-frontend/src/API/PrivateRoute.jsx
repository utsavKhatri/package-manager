import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = ({ allowedPaths, role }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.authPage);
  const user = JSON.parse(localStorage.getItem('user'));

  if (!isAuthenticated || !user?.token) {
    return <Navigate to="/login" />;
  }

  if (!allowedPaths.includes(location.pathname)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
