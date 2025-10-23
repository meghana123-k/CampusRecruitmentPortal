import React, { useState } from "react";
import "./PostJobPage.css"; // ✅ Import CSS

const PostJobPage: React.FC = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    jobType: "FULL_TIME",
    applicationDeadline: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const jobData = {
      title: form.title.trim(),
      description: form.description.trim(),
      requirements: form.requirements.trim(),
      location: form.location.trim(),
      salaryMin: form.salaryMin ? parseFloat(form.salaryMin) : undefined,
      salaryMax: form.salaryMax ? parseFloat(form.salaryMax) : undefined,
      jobType: form.jobType,
      applicationDeadline: form.applicationDeadline || undefined,
    };

    try {
      const response = await fetch("http://localhost:5000/api/v1/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Job posted successfully!");
        setForm({
          title: "",
          description: "",
          requirements: "",
          location: "",
          salaryMin: "",
          salaryMax: "",
          jobType: "FULL_TIME",
          applicationDeadline: "",
        });
      } else {
        alert("❌ Failed to post job: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Network error: Could not reach backend.");
    }
  };

  return (
    <div className="post-job-container">
      <h1 className="form-title">📢 Post a New Job</h1>

      <form onSubmit={handleSubmit} className="post-job-form">
        <input
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Job Description (min 10 chars)"
          value={form.description}
          onChange={handleChange}
          required
        />
        <textarea
          name="requirements"
          placeholder="Requirements (min 10 chars)"
          value={form.requirements}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <div className="salary-group">
          <input
            name="salaryMin"
            placeholder="Min Salary"
            type="number"
            value={form.salaryMin}
            onChange={handleChange}
          />
          <input
            name="salaryMax"
            placeholder="Max Salary"
            type="number"
            value={form.salaryMax}
            onChange={handleChange}
          />
        </div>
        <select name="jobType" value={form.jobType} onChange={handleChange}>
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="INTERNSHIP">Internship</option>
        </select>
        <input
          name="applicationDeadline"
          type="date"
          value={form.applicationDeadline}
          onChange={handleChange}
        />

        <button type="submit" className="submit-btn">
          🚀 Post Job
        </button>
      </form>
    </div>
  );
};

export default PostJobPage;
