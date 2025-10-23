import React, { useEffect, useState } from 'react';
import apiService from '../services/api';
import type { Job } from '../types';

const RecruiterDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await apiService.getJobsByRecruiter();
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error('Error fetching recruiter jobs:', err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Recruiter Dashboard</h1>
      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id} className="border p-4 mb-2 rounded">
              <h2 className="text-lg font-bold">{job.title}</h2>
              <p>{job.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecruiterDashboard;
