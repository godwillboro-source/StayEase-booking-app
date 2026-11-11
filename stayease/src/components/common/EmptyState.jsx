const EmptyState = ({ title = "No items found", message = "" }) => {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EmptyState;