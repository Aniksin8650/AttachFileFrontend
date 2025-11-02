import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🌐 Common Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// 🧭 User Pages
import Dashboard from "./components/Dashboard";
import LeaveApplication from "./components/LeaveApplication";
import TadaApplication from "./components/TadaApplication";
import About from "./components/About";
import Settings from "./components/Settings";

// 🔐 Admin Pages
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import AdminLeave from "./components/AdminLeave";
import AdminTada from "./components/AdminTada";
import AdminLtc from "./components/AdminLtc";
import AdminOther from "./components/AdminOther";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar stays on top for all pages */}
        <Navbar />

        {/* Page Content */}
        <div style={{ minHeight: "80vh", marginTop: "80px" }}>
          <Routes>
            {/* Main User Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/leave-application" element={<LeaveApplication />} />
            <Route path="/tada-application" element={<TadaApplication />}/>
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />

            {/* Admin Related Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-leave" element={<AdminLeave />} />
            <Route path="/admin-tada" element={<AdminTada />} />
            <Route path="/admin-ltc" element={<AdminLtc />} />
            <Route path="/admin-other" element={<AdminOther />} />
          </Routes>
        </div>

        {/* Footer always at the bottom */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
