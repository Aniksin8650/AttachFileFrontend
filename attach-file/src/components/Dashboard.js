import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const handleNavigate = (type) => {
    // go directly to the right page
    if (type === "leave") navigate("/leave-application", { state: { applicationType: type } });
    else if (type === "tada") navigate("/tada-application", { state: { applicationType: type } });
    else if (type === "ltc") navigate("/ltc-application", { state: { applicationType: type } });
    else navigate("/other-application", { state: { applicationType: type } });
  };

  return (
    <div className="dashboard">
      <div className="button-grid">
        <button className="dash-btn btn1" onClick={() => handleNavigate("leave")}>
          Leave Application
        </button>
        <button className="dash-btn btn2" onClick={() => handleNavigate("tada")}>
          TADA
        </button>
        <button className="dash-btn btn3" onClick={() => handleNavigate("ltc")}>
          LTC
        </button>
        <button className="dash-btn btn4" onClick={() => handleNavigate("other")}>
          Other
        </button>
      </div>
    </div>
  );
}

export default Dashboard;



// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./../styles/Dashboard.css";

// function Dashboard() {
//   const navigate = useNavigate();

//   return (
//     <div className="dashboard">
//       <button
//         className="dash-btn btn1"
//         onClick={() => navigate("/leave-application")}
//       >
//         Leave Application
//       </button>
//       <button className="dash-btn btn2">TADA</button>
//       <button className="dash-btn btn3">LTC</button>
//       <button className="dash-btn btn4">Other</button>
//     </div>
//   );
// }

// export default Dashboard;

// function Dashboard() {
//   const navigate = useNavigate();

//   return (
    
//     <div className="dashboard">
//       <div className="left">
//         <button
//           className="dash-btn btn1"
//           onClick={() => navigate("/leave-application")}
//         >
//           Leave Application
//         </button>
//         <button className="dash-btn btn2">TADA</button>
//         </div>
//         <div className="right">
//         <button className="dash-btn btn3">LTC</button>
//         <button className="dash-btn btn4">Other</button>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;