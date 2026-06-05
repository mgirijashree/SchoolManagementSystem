import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  // 1. Get user data saved from your login form submission
  const userRole = localStorage.getItem("userRole"); 
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  // If not logged in at all, kick them to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, but their role isn't allowed on this specific page path layout
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If a teacher tries to access admin spaces, bounce them back to a generic fallback or dashboard
    return <Navigate to="/unauthorized" replace />;
  }

  // Everything checks out! Render the internal component pages safely
  return <Outlet />;
};

export default ProtectedRoute;