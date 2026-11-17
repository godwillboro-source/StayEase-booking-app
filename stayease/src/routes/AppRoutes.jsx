
import React from "react";
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// Layouts
import MainLayout from "../components/layout/Mainlayout";
import DashboardLayout from "../components/layout/Dashboardlayout";

// Route protection
import ProtectedRoute from "./ProtectedRoute";
import RoutePlaceholder from "./RoutePlaceholder";

// Authentication pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Customer pages
import Home from "../pages/customer/Home";
import BrowseProperties from "../pages/customer/BrowseProperties";
import PropertyDetails from "../pages/customer/PropertyDetails";
import BookingForm from "../pages/customer/BookingForm";
import MyBookings from "../pages/customer/MyBookings";
import BookingDetails from "../pages/customer/BookingDetails";

// Manager pages
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import MyProperties from "../pages/manager/MyProperties";
import AddProperty from "../pages/manager/AddProperty";
import EditProperty from "../pages/manager/EditProperty";
import ManageUnits from "../pages/manager/ManageUnits";
import EditUnit from "../pages/manager/EditUnit";
import ManagerBookings from "../pages/manager/ManagerBookings";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminManagers from "../pages/admin/Managers";
import AdminProperties from "../pages/admin/Properties";
import AdminBookings from "../pages/admin/Bookings";
import AdminCities from "../pages/admin/Cities";

function AppRoutes() {
  return (
    <Routes>

      {/* ================================== */}
      {/* PUBLIC ROUTES */}
      {/* ================================== */}

      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/properties"
          element={<BrowseProperties />}
        />

        <Route
          path="/properties/:propertyId"
          element={<PropertyDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/unauthorized"
          element={
            <RoutePlaceholder title="Access Denied" />
          }
        />

        <Route
          path="/404"
          element={
            <RoutePlaceholder title="Page Not Found" />
          }
        />

        {/* Customer booking form */}
        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route
            path="/properties/:propertyId/book"
            element={<BookingForm />}
          />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="managers" element={<AdminManagers />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="cities" element={<AdminCities />} />
        </Route>
      </Route>

      {/* ================================== */}
      {/* CUSTOMER DASHBOARD ROUTES */}
      {/* ================================== */}

      <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
        <Route path="/customer" element={<DashboardLayout />}>

          <Route
            index
            element={<Navigate to="bookings" replace />}
          />

          <Route
            path="dashboard"
            element={<MyBookings />}
          />

          <Route
            path="bookings"
            element={<MyBookings />}
          />

          <Route
            path="bookings/:bookingId"
            element={<BookingDetails />}
          />

        </Route>
      </Route>


      {/* ================================== */}
      {/* MANAGER ROUTES */}
      {/* ================================== */}

      <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
        <Route path="/manager" element={<DashboardLayout />}>

          <Route
            index
            element={<ManagerDashboard />}
          />

          <Route
            path="dashboard"
            element={<ManagerDashboard />}
          />

          <Route
            path="properties"
            element={<MyProperties />}
          />

          <Route
            path="properties/new"
            element={<AddProperty />}
          />

          <Route
            path="properties/:propertyId/edit"
            element={<EditProperty />}
          />

          <Route
            path="properties/:propertyId/units"
            element={<ManageUnits />}
          />

          <Route
            path="properties/:propertyId/units/:unitId/edit"
            element={<EditUnit />}
          />

          <Route
            path="bookings"
            element={<ManagerBookings />}
          />

        </Route>
      </Route>


      {/* ================================== */}
      {/* FALLBACK */}
      {/* ================================== */}

      <Route
        path="*"
        element={<Navigate to="/404" replace />}
      />

    </Routes>
  );
}

export default AppRoutes;
