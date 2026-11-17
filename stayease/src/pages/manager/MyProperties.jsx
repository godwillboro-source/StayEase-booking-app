import { Link } from "react-router-dom";

import { useAuth } from "../../context/useAuth";
import { useBookings } from "../../context/useBookings";

import PropertyList from "../../components/manager/PropertyList";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

const MyProperties = () => {
  const { currentUser } = useAuth();

  const { properties, loading, error } = useBookings();

  if (loading) {
    return <Loading />;
  }
  if (error) return <ErrorMessage message={error} />;

  const myProperties = properties.filter(
    (property) => String(property.managerId) === String(currentUser.id)
  );

  return (
    <div className="manager-page">
      <div className="manager-page-header">
        <div>
          <p className="page-eyebrow">PROPERTY MANAGEMENT</p>
          <h1>My Properties</h1>
          <p>View and manage your registered accommodation.</p>
        </div>

        <Link to="/manager/properties/new" className="primary-link">
          + Add Property
        </Link>
      </div>

      <PropertyList properties={myProperties} />
    </div>
  );
};

export default MyProperties;