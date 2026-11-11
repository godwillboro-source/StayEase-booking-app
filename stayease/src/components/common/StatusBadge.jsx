const StatusBadge = ({ status, children }) => {
  const displaytext = children || status;
  return (
    <span className={`status-badge ${status ? status.toLowerCase() : ''}`}>
      {displaytext}
    </span>
  );
};

export default StatusBadge;