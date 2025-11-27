import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../../Shared/Footer";
import "../AdminDashboard.css";
import "./AdminLeaveRequests.css";
import "../AdminRequestsPortal.css"; // reuse the same header styles

const API_BASE = "http://localhost:8080";

const AdminRequestsPage = ({
  title,
  baseUrl,
  entityLabel,
  renderDetails,
  badgeText = "Admin • Requests",
  subtitle,
  backTo = "/admin/requests",
}) => {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("PENDING");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRequests = useCallback(
    async (status) => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${API_BASE}${baseUrl}/status/${status}`);
        setRequests(res.data || []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data ||
            `Failed to load ${entityLabel}. Please try again.`
        );
      } finally {
        setLoading(false);
      }
    },
    [baseUrl, entityLabel]
  );

  useEffect(() => {
    fetchRequests(activeTab);
  }, [activeTab, fetchRequests]);

  const handleAction = async (applnNo, newStatus) => {
    try {
      await axios.put(`${API_BASE}${baseUrl}/status/${applnNo}`, {
        status: newStatus,
      });

      setRequests((prev) => prev.filter((req) => req.applnNo !== applnNo));
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data ||
          `Failed to update status to ${newStatus}. Please try again.`
      );
    }
  };

  const renderTabLabel = (tab) => {
    if (tab === "PENDING") return "Requests";
    if (tab === "APPROVED") return "Accepted";
    if (tab === "REJECTED") return "Rejected";
    return tab;
  };

  return (
    <div>
      {/* 🔹 Hero-style admin header */}
      <div className="admin-req">
        <div className="admin-req-header">
          <div>
            <p className="admin-req-badge">{badgeText}</p>
            <h1>{title}</h1>
            {subtitle && (
              <p className="admin-req-subtitle">{subtitle}</p>
            )}
          </div>

          <Link to={backTo} className="admin-req-home-link">
            ← Back to Requests Portal
          </Link>
        </div>

        {/* Inner content container */}
        <div className="admin-leave-container">
          {/* Tabs */}
          <div className="tab-buttons">
            <button
              className={activeTab === "PENDING" ? "active" : ""}
              onClick={() => setActiveTab("PENDING")}
            >
              Requests
            </button>
            <button
              className={activeTab === "APPROVED" ? "active" : ""}
              onClick={() => setActiveTab("APPROVED")}
            >
              Accepted
            </button>
            <button
              className={activeTab === "REJECTED" ? "active" : ""}
              onClick={() => setActiveTab("REJECTED")}
            >
              Rejected
            </button>
          </div>

          {/* Loading / Error */}
          {loading && (
            <p className="loading-text">
              Loading {renderTabLabel(activeTab)}...
            </p>
          )}
          {error && <p className="error-text">{error}</p>}

          {/* Requests list */}
          <div className="requests-section">
            {!loading && !error && requests.length === 0 ? (
              <p className="no-requests">
                No {renderTabLabel(activeTab).toLowerCase()} in {entityLabel}.
              </p>
            ) : (
              requests.map((req) => (
                <div key={req.id ?? req.applnNo} className="request-card">
                  <div className="request-details">
                    {renderDetails(req)}
                    <p>
                      <strong>Status:</strong> {req.status}
                    </p>
                  </div>

                  {req.status === "PENDING" && (
                    <div className="action-buttons">
                      <button
                        className="accept-btn"
                        onClick={() =>
                          handleAction(req.applnNo, "APPROVED")
                        }
                      >
                        ✅ Accept
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() =>
                          handleAction(req.applnNo, "REJECTED")
                        }
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminRequestsPage;
