import React from "react";
import "../styles/About.css";

const About = () => {
  return (
    <div className="about-container">
      <h1>About This Project</h1>
      <p>
        This Employee Management Portal is designed to simplify employee
        operations such as leave management, TADA, and LTC requests.
      </p>
      <p>
        Built with <strong>React.js</strong> on the frontend and{" "}
        <strong>Spring Boot</strong> on the backend, this system ensures smooth
        communication and data handling between employees and administrators.
      </p>
      <p>Version: 1.0.0</p>
    </div>
  );
};

export default About;
