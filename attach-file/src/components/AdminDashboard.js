import React from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import Footer from "./Footer";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <AdminNavbar />

      <div className="admin-dashboard">
        <div className="admin-buttons">
          <button className="admin-btn btn1" onClick={() => navigate("/admin-leave")}>
            Leave Requests
          </button>
          <button className="admin-btn btn2" onClick={() => navigate("/admin-tada")}>
            TADA Requests
          </button>
          <button className="admin-btn btn3" onClick={() => navigate("/admin-ltc")}>
            LTC Requests
          </button>
          <button className="admin-btn btn4" onClick={() => navigate("/admin-other")}>
            Other Requests
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
