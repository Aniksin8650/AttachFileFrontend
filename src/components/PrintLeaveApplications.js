import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PrintLeaveApplications.css";

function PrintLeaveApplications() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide header/footer
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    if (header) header.style.display = "none";
    if (footer) footer.style.display = "none";

    // Fetch data
    axios.get("http://localhost:8080/api/leave/all")
      .then(res => {
        setLeaves(res.data);
        setLoading(false);
        //setTimeout(() => window.print(), 800);  auto print
      })
      .catch(err => {
        console.error("Error fetching leave applications:", err);
        setLoading(false);
      });

    return () => {
      if (header) header.style.display = "";
      if (footer) footer.style.display = "";
    };
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="print-container">
      <div className="report-header">
        <h2>Leave Application Report</h2>
        <p>Generated on: {new Date().toLocaleString()}</p>
      </div>

      <table className="print-table">
        <thead>
          <tr>
            <th>Emp ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Reason</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Contact</th>
            <th>Attached Files</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((l, index) => (
            <tr key={index}>
              <td>{l.id?.empId}</td>
              <td>{l.name}</td>
              <td>{l.department}</td>
              <td>{l.designation}</td>
              <td>{l.reason}</td>
              <td>{l.id?.startDate}</td>
              <td>{l.id?.endDate}</td>
              <td>{l.contact}</td>
              <td>{l.fileName}</td>
              <td>{l.applicationType}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="print-btn" onClick={() => window.print()}>
        🖨️ Print / Save as PDF
      </button>
    </div>
  );
}

export default PrintLeaveApplications;
