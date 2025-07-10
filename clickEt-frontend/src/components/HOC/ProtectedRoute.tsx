import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { routeConfig } from '@/lib/routerConfig';
import { ERoles } from '@/interfaces/auth/IAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Wait for authentication check to complete
  if (isLoading) {
    return null; // or your loading component
  }

  // Find the route configuration for the current path
  const currentRoute = Object.values(routeConfig).find(route => {
    // Convert route path to regex to handle dynamic parameters
    const pathRegex = new RegExp(
      '^' + route.path.replace(/:\w+/g, '([^/]+)') + '$'
    );
    return pathRegex.test(location.pathname);
  });

  // Case 4: Route not found in config - redirect to 404
  // Exclude the 404 page itself from this check to prevent infinite loops
  if (!currentRoute && location.pathname !== '/404') {
    return <Navigate to="/404" replace />;
  }

  // Special case for unauthorized to login flow
  if (location.pathname === '/login') {
    // Allow access to login if user came from unauthorized page or clicking "Get Permission"
    const cameFromUnauthorized = location.state?.from === '/unauthorized';
    const isGetPermissionFlow = location.state?.getPermission === true;
    
    if (cameFromUnauthorized || isGetPermissionFlow) {
      return <>{children}</>;
    }
    // Otherwise, redirect authenticated users
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }
  }

  // Regular login/register pages check
  if (['/register'].includes(location.pathname)) {
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }
  }

  // Case 1: Protected route but not authenticated
  if (currentRoute?.isProtected && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Case 3: Role-based access check
  if (currentRoute?.roles && isAuthenticated && user) {
    const hasRequiredRole = currentRoute.roles.includes(user.role as ERoles);
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If all checks pass, render the route
  return <>{children}</>;
};

export default ProtectedRoute;