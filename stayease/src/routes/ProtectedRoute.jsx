import React from "react";
import {
  Navigate,
  Outlet,
  useLocation
} from "react-router-dom";

import { useAuth } from "../context/useAuth";
import Loading from "../components/common/Loading";

function ProtectedRoute({ allowedRoles = [] }) {
  const {
    currentUser,
    loading,
    isAuthenticated
  } = useAuth();

  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(currentUser.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;