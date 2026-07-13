import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { ROUTES } from "../constants/routes";
import AppLoader from "../components/common/AppLoader";

/**
 * ProtectedRoute — wraps any routes requiring authentication.
 * Optionally accepts an `allowedRoles` prop to restrict by role.
 *
 * Usage in routes:
 *   <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
 *     <Route path="..." element={<AdminPage />} />
 *   </Route>
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, hasRole } = useAuthContext();

  if (isLoading) return <AppLoader />;

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && !allowedRoles.some((role) => hasRole(role))) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
