import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return token ? <Outlet /> : <Navigate to="/auth" />;
}

export default PrivateRoute;
