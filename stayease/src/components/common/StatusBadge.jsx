import React from "react";

function StatusBadge({ status }) {
  const normalizedStatus = String(status || "unknown")
    .toLowerCase()
    .replaceAll(" ", "-");

  const labels = {
    pending: "Pending",
    rejected: "Rejected",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    completed: "Completed"
  };

  return (
    <span className={`status-badge status-${normalizedStatus}`}>
      {labels[normalizedStatus] || normalizedStatus}
    </span>
  );
}

export default StatusBadge;