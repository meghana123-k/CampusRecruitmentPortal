import React, { useEffect, useState } from 'react';
import apiService from '../services/api';
import type { Job } from '../types';

const BrowseJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await apiService.getAllJobs();
        setJobs(res.data.jobs || []); // <-- jobs array from backend
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Browse Jobs</h1>
      {jobs.length === 0 ? (
        <p>No jobs available right now.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id} className="border p-4 mb-2 rounded">
              <h2 className="text-lg font-bold">{job.title}</h2>
              <p>{job.description}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> {job.salaryMin} - {job.salaryMax}</p>
              <p><strong>Type:</strong> {job.jobType}</p>
              <p><strong>Deadline:</strong> {job.applicationDeadline?.slice(0, 10)}</p>
              <button className="bg-green-600 text-white px-4 py-2 mt-2 rounded">Apply</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BrowseJobsPage;
