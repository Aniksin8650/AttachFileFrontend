import React from "react";
import AdminRequestsPage from "./AdminRequestsPage";

const AdminLeave = () => {
  return (
    <AdminRequestsPage
      title="Leave Requests"
      baseUrl="/api/leave"
      entityLabel="leave requests"
      renderDetails={(req) => (
        <>
          <p>
            <strong>Employee:</strong> {req.name} ({req.empId})
          </p>
          <p>
            <strong>From:</strong> {req.startDate} — <strong>To:</strong>{" "}
            {req.endDate}
          </p>
          <p>
            <strong>Reason:</strong> {req.reason}
          </p>
          {req.applicationType && (
            <p>
              <strong>Type:</strong> {req.applicationType}
            </p>
          )}
          {req.applnNo && (
            <p>
              <strong>Appln No:</strong> {req.applnNo}
            </p>
          )}
        </>
      )}
    />
  );
};

export default AdminLeave;
