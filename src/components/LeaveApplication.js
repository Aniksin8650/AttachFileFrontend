import React, { useState, useRef } from "react";
import "./../styles/LeaveApplication.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function LeaveApplication() {
  const location = useLocation();
  const { applicationType } = location.state || { applicationType: "leave" }; // default "leave"
  const navigate = useNavigate();

  const [employeeId, setEmployeeId] = useState("");
  const [employeeData, setEmployeeData] = useState({});
  const [reason, setReason] = useState("");
  const [contact, setContact] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [file, setFile] = useState([]);

  const [errors, setErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [applications, setApplications] = useState([]); // stores submitted applications
  const [editingIndex, setEditingIndex] = useState(null); // track editing mode

  const fileInputRef = useRef(null);

  // Fetch employee data by ID
  const fetchEmployeeDetails = async () => {
    const id = employeeId.trim();
    if (!id) {
      setEmployeeData({});
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/api/employees/id/${id}`);
      if (res.ok) {
        const data = await res.json();
        setEmployeeData(data);
      } else {
        setEmployeeData({});
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
      setEmployeeData({});
    }
  };

  const getInputClass = (field) =>
    submitAttempted && errors[field] ? "input-error" : "";

  // Submit or Update form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

  const newErrors = {};

  // ✅ Employee validation
  if (!employeeId.trim()) newErrors.employeeId = true;
  if (!employeeData || !employeeData.empId) newErrors.employeeId = true;

  // ✅ Reason must be filled
  if (!reason.trim()) newErrors.reason = true;

  // ✅ Dates must be valid and in correct order
  if (!startDate) newErrors.startDate = true;
  if (!endDate) newErrors.endDate = true;
  if (startDate && endDate && new Date(endDate) < new Date(startDate))
    newErrors.endDate = true;

  // ✅ Contact number must be exactly 10 digits
  if (!contact || contact.length !== 10) newErrors.contact = true;

  // ✅ At least one file must be attached
  if (!file || file.length === 0) newErrors.file = true;

  // Stop and alert if any validation failed
  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) {
    let msg = "Please fix the highlighted fields before submitting:\n";
    if (newErrors.employeeId) msg += "- Employee ID is invalid or missing\n";
    if (newErrors.reason) msg += "- Reason for leave is required\n";
    if (newErrors.startDate || newErrors.endDate)
      msg += "- Please check your leave dates\n";
    if (newErrors.contact) msg += "- Contact number must be 10 digits\n";
    if (newErrors.file) msg += "- At least one attachment is required\n";
    alert(msg);
    return;
  }


    const formData = new FormData();
    formData.append("empId", employeeData.empId);
    formData.append("applicationType", applicationType);
    formData.append("name", employeeData.name);
    formData.append("department", employeeData.department);
    formData.append("designation", employeeData.designation);
    formData.append("reason", reason);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("contact", contact);
    if (file.length > 0) {
      file
        .filter((f) => !f.isServerFile)
        .forEach((f) => formData.append("files", f));   
  }
  // ✅ Send the names of server files that are still kept
    const retainedFiles = file
      .filter((f) => f.isServerFile)
      .map((f) => f.name)
      .join(";");
    formData.append("retainedFiles", retainedFiles);


    // Generate or reuse token
    const token =
      editingIndex !== null
        ? applications[editingIndex].token
        : `APP-${Date.now()}`;

    formData.append("token", token);

    try {
      const url =
        editingIndex !== null
          ? `http://localhost:8080/api/leave/update/${token}` // update endpoint
          : "http://localhost:8080/api/leave/submit"; // submit endpoint

      const method = editingIndex !== null ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      // 🔍 Add this overlap check block here
      if (res.status === 409) {
        const msg = await res.text();
        alert(msg); // show backend message like "Leave dates overlap..."
        return; // stop further processing
      }

      if (res.ok) {
        // Build local application object (no files content, only metadata)
        const newApplication = {
          token,
          empId: employeeData.empId,
          name: employeeData.name,
          department: employeeData.department,
          designation: employeeData.designation,
          reason,
          startDate,
          endDate,
          contact,
          applicationType,
          files: file.map((f) => ({ name: f.name, type: f.type })),
        };

        if (editingIndex !== null) {
          // update existing record
          const updatedList = [...applications];
          updatedList[editingIndex] = newApplication;
          setApplications(updatedList);
          setEditingIndex(null);
          setSuccessMessage("Application updated successfully!");
        } else {
          // add new record
          setApplications((prev) => [...prev, newApplication]);
          setSuccessMessage("Leave application submitted successfully!");
        }

        // Reset form
        setTimeout(() => setSuccessMessage(""), 5000);
        setEmployeeId("");
        setEmployeeData({});
        setReason("");
        setContact("");
        setStartDate("");
        setEndDate("");
        setFile([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setSubmitAttempted(false);
        setErrors({});
      } else {
        alert("Failed to submit or update leave application.");
      }
    } catch (error) {
      console.error("Error submitting leave:", error);
      alert("Error submitting leave application.");
    }
  };

  // Handle Edit
  const handleEdit = async (index) => {
    const app = applications[index];
    setEmployeeId(app.empId);
    setEmployeeData({
      empId: app.empId,
      name: app.name,
      department: app.department,
      designation: app.designation,
    });
    setReason(app.reason);
    setStartDate(app.startDate);
    setEndDate(app.endDate);
    setContact(app.contact);
    setEditingIndex(index);

    // ✅ Fetch the existing application from backend (to get files)
    try {
      const res = await fetch(`http://localhost:8080/api/leave/token/${app.token}`);
      if (res.ok) {
        const data = await res.json();

        if (data.fileName) {
          // Split filenames (semicolon-separated) and map to preview objects
          const filesFromServer = data.fileName.split(";").filter(Boolean).map((name) => ({
            name,
            // Assuming files are stored like: uploads/<applicationType>/<empId>/<filename>
            // adjust if your path differs
            url: `http://localhost:8080/uploads/${data.applicationType}/${data.empId}/${name}`,
            isServerFile: true, // flag to know these are old files
          }));

          setFile(filesFromServer);
        } else {
          setFile([]);
        }
      }
    } catch (err) {
      console.error("Error fetching existing files:", err);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <>
      {/* Upper form container (keeps original style & layout) */}
      <div className="leave-container">
        <h2>Leave Application</h2>

        {successMessage && <div className="success-message">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Employee ID:</label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => {
                if (e.target.value.length <= 6) setEmployeeId(e.target.value);
              }}
              onBlur={fetchEmployeeDetails}
              onKeyDown={(e) => {
                if (e.key === "Enter") fetchEmployeeDetails();
              }}
              placeholder="Enter Employee ID"
              className={getInputClass("employeeId")}
            />
          </div>

          <div className="form-row">
            <label>Application Type:</label>
            <input type="text" value={applicationType.toUpperCase()} readOnly />
          </div>

          <div className="form-row">
            <label>Name:</label>
            <input type="text" value={employeeData.name || ""} readOnly />
          </div>

          <div className="form-row">
            <label>Department:</label>
            <input type="text" value={employeeData.department || ""} readOnly />
          </div>

          <div className="form-row">
            <label>Designation:</label>
            <input type="text" value={employeeData.designation || ""} readOnly />
          </div>

          <div className="form-row">
            <label>Reason for Leave:</label>
            <input
              type="text"
              placeholder="Enter reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={getInputClass("reason")}
            />
          </div>

          <div className="form-row">
            <label>Leave Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                const newStart = e.target.value;
                setStartDate(newStart);
                if (endDate && new Date(endDate) < new Date(newStart)) {
                  setEndDate("");
                }
              }}
              className={getInputClass("startDate")}
            />
          </div>

          <div className="form-row">
            <label>Leave End Date:</label>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              className={getInputClass("endDate")}
            />
          </div>

          <div className="form-row">
            <label>Contact During Leave:</label>
            <div className="phone-input">
              <span>+91</span>
              <input
                type="text"
                placeholder="Enter 10-digit number"
                value={contact}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 10) setContact(val);
                }}
              />
            </div>
          </div>

          {/* File Upload Section */}
          <div className="form-row attach-row">
            <label>Attachments:</label>

            <div className="attach-section">
              <button
                type="button"
                className="attach-btn"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                {file.length > 0 ? "Add More" : "Attach File"}
              </button>

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                multiple
                onChange={(e) => {
                  const selectedFiles = Array.from(e.target.files);
                  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
                  const allowedNamePattern = /^[a-zA-Z0-9_\s-]{3,20}$/;

                  const validFiles = [];

                  selectedFiles.forEach((selectedFile) => {
                    const baseName = selectedFile.name.split(".")[0];

                    if (!allowedTypes.includes(selectedFile.type)) {
                      alert(`${selectedFile.name} is not a valid file type! Only PDF, JPG, PNG allowed.`);
                      return;
                    }

                    if (!allowedNamePattern.test(baseName)) {
                      alert(
                        `Invalid file name "${selectedFile.name}". File names should be 3–20 characters long, contain only letters, numbers, dashes, or underscores.`
                      );
                      return;
                    }

                    if (file && Array.isArray(file) && file.some((f) => f.name === selectedFile.name)) {
                      alert(`File "${selectedFile.name}" already added.`);
                      return;
                    }

                    validFiles.push(selectedFile);
                  });

                  if (validFiles.length > 0) {
                    setFile((prev) => [...prev, ...validFiles]);
                  }

                  e.target.value = "";
                }}
              />

              {file.length > 0 && (
                <div className="file-preview-list">
                  {file.map((fileItem, index) => {
                    // ✅ Check if this file came from the server (existing application) or was newly selected
                    const fileURL = fileItem.isServerFile
                      ? fileItem.url // pre-existing file (fetched from backend)
                      : URL.createObjectURL(fileItem); // newly uploaded file

                    return (
                      <div key={index} className="file-preview">
                        <a
                          href={fileURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Click to preview"
                          className="file-link"
                        >
                          {/* ✅ Show either file name or thumbnail depending on file type */}
                          {fileItem.name.toLowerCase().endsWith(".pdf") ? (
                            <p className="file-name">{fileItem.name}</p>
                          ) : (
                            <img src={fileURL} alt={fileItem.name} className="file-thumb" />
                          )}
                        </a>

                        {/* ✅ Remove button to delete selected or old file */}
                        <button
                          type="button"
                          onClick={() =>
                            setFile((prev) => prev.filter((_, i) => i !== index))
                          }
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="button-row">
            <button type="submit" className="submit-btn">
              {editingIndex !== null ? "Update Application" : "Submit Application"}
            </button>

            <button
              type="button"
              className="reset-btn"
              onClick={() => {
                setEmployeeId("");
                setEmployeeData({});
                setReason("");
                setContact("");
                setStartDate("");
                setEndDate("");
                setFile([]);
                if (fileInputRef.current) fileInputRef.current.value = "";
                setEditingIndex(null);
                setSubmitAttempted(false);
                setErrors({});
                setSuccessMessage("");
              }}
            >
              Reset
            </button>
          </div>

        </form>
      </div>
      
      <div className="print-btn-container">
        <button
          className="print-btn"
          onClick={() => window.open("/print-leaves", "_blank")}
        >
          🖨️ Print All Leave Applications
        </button>
      </div>

      {/* Bottom table section: placed OUTSIDE the form container so it can span full width */}
      {applications.length > 0 && (
        <div className="submitted-section-wrapper">
          <div className="submitted-section">
            <h3>Submitted Applications</h3>
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Reason</th>
                  <th>Files</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr key={app.token}>
                    <td>{app.token}</td>
                    <td>{app.empId}</td>
                    <td>{app.name}</td>
                    <td>{app.applicationType}</td>
                    <td>{app.startDate}</td>
                    <td>{app.endDate}</td>
                    <td>{app.reason}</td>
                    <td>
                      {app.files && app.files.length > 0
                        ? app.files.map((f, i) => <div key={i}>{f.name}</div>)
                        : "—"}
                    </td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(index)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default LeaveApplication;
