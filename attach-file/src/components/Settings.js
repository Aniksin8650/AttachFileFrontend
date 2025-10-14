import React, { useState } from "react";
import "../styles/Settings.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("General");

  const renderContent = () => {
    switch (activeTab) {
      case "General":
        return (
          <div>
            <h2>General Settings</h2>
            <p>Update your name, email, and basic information here.</p>
          </div>
        );
      case "Notifications":
        return (
          <div>
            <h2>Notification Settings</h2>
            <p>Choose how you receive notifications and alerts.</p>
          </div>
        );
      case "Privacy":
        return (
          <div>
            <h2>Privacy Settings</h2>
            <p>Control who can see your profile and activity.</p>
          </div>
        );
      case "Display":
        return (
          <div>
            <h2>Display Settings</h2>
            <p>Customize theme, font size, and visual layout.</p>
          </div>
        );
      case "Security":
        return (
          <div>
            <h2>Security Settings</h2>
            <p>Change your password and enable two-factor authentication.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      {/* Sidebar */}
      <div className="settings-sidebar">
        {["General", "Notifications", "Privacy", "Display", "Security"].map(
          (item) => (
            <div
              key={item}
              className={`settings-item ${
                activeTab === item ? "active" : ""
              }`}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </div>
          )
        )}
      </div>

      {/* Content */}
      <div className="settings-content">{renderContent()}</div>
    </div>
  );
};

export default Settings;
