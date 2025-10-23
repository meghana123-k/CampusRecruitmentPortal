import React, { useEffect, useState } from "react";
import apiService from "../services/api";
import type { Job } from "../types";
import "./BrowseJobsPage.css"; // ✅ Import CSS

const BrowseJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

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

  return (
    <div className="browse-container">
      <h1 className="page-title">💼 Browse Jobs</h1>

      {jobs.length === 0 ? (
        <p className="no-jobs">No jobs available right now.</p>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job.id} className="job-card hover:scale-105 transition-transform duration-200">
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

              <button className="apply-btn">Apply Now</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseJobsPage;
