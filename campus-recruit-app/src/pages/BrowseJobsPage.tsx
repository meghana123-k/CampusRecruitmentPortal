import React, { useEffect, useState } from "react";
import apiService from "../services/api";
import type { Job } from "../types";
import "./BrowseJobsPage.css";

interface StudentFormData {
  applicantName: string;
  applicantEmail: string;
  graduationYear: string;
  skills: string;
  coverLetter: string;
}

const BrowseJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<StudentFormData>({
    applicantName: "",
    applicantEmail: "",
    graduationYear: "",
    skills: "",
    coverLetter: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await apiService.getAllJobs();
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!selectedJob) {
      alert("Please select a job first!");
      return;
    }
  
    // Basic frontend validation before sending
    if (
      !formData.applicantName.trim() ||
      !formData.applicantEmail.trim() ||
      !formData.graduationYear.trim() ||
      !formData.skills.trim()
    ) {
      alert("Please fill in all required fields!");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const payload = {
        applicantName: formData.applicantName.trim(),
        applicantEmail: formData.applicantEmail.trim(),
        graduationYear: Number(formData.graduationYear),
        skills: formData.skills.trim(),
        coverLetter: formData.coverLetter.trim(),
      };
  
      const res = await fetch("http://localhost:5000/api/v1/applications/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert("✅ Application submitted successfully!");
        setSelectedJob(null);
        setFormData({
          applicantName: "",
          applicantEmail: "",
          graduationYear: "",
          skills: "",
          coverLetter: "",
        });
      } else {
        const errorMsg =
          data.errors?.map((err: any) => err.msg).join(", ") || data.message || "Failed to submit application.";
        alert("❌ " + errorMsg);
      }
    } catch (err) {
      console.error("Error submitting application:", err);
      alert("❌ Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  


  return (
    <div className="browse-container">
      <h1 className="page-title">💼 Browse Jobs</h1>

      {jobs.length === 0 ? (
        <p className="no-jobs">No jobs available right now.</p>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <h2 className="job-title">{job.title}</h2>
                <span className="job-type">{job.jobType}</span>
              </div>
              <p className="job-description">{job.description}</p>
              <div className="job-info">
                <p><strong>📍 Location:</strong> {job.location}</p>
                <p><strong>💰 Salary:</strong> ₹{job.salaryMin} - ₹{job.salaryMax}</p>
                <p><strong>🕓 Deadline:</strong> {job.applicationDeadline?.slice(0, 10)}</p>
              </div>
              <button
                className="apply-btn"
                onClick={() => setSelectedJob(job)}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedJob && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Apply for {selectedJob.title}</h2>

            <form onSubmit={handleSubmit} className="application-form">
              <input
                type="text"
                name="applicantName"
                placeholder="Full Name"
                value={formData.applicantName}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="applicantEmail"
                placeholder="Email"
                value={formData.applicantEmail}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="graduationYear"
                placeholder="Graduation Year (e.g., 2026)"
                value={formData.graduationYear}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="skills"
                placeholder="Skills (e.g., React, Python)"
                value={formData.skills}
                onChange={handleChange}
                required
              />
              <textarea
                name="coverLetter"
                placeholder="Write a short cover letter..."
                value={formData.coverLetter}
                onChange={handleChange}
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setSelectedJob(null)}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseJobsPage;
