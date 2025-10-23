import React, { useState } from 'react';

const PostJobPage: React.FC = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    jobType: 'FULL_TIME', // must match backend enum
    applicationDeadline: '', // must be YYYY-MM-DD
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert salary to float
    const jobData = {
      title: form.title.trim(),
      description: form.description.trim(),
      requirements: form.requirements.trim(),
      location: form.location.trim(),
      salaryMin: form.salaryMin ? parseFloat(form.salaryMin) : undefined,
      salaryMax: form.salaryMax ? parseFloat(form.salaryMax) : undefined,
      jobType: form.jobType, // FULL_TIME | PART_TIME | INTERNSHIP
      applicationDeadline: form.applicationDeadline || undefined, // YYYY-MM-DD
    };

    try {
      const response = await fetch('http://localhost:5000/api/v1/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Job posted successfully!');
        setForm({
          title: '',
          description: '',
          requirements: '',
          location: '',
          salaryMin: '',
          salaryMax: '',
          jobType: 'FULL_TIME',
          applicationDeadline: '',
        });
      } else {
        console.error('Failed:', data);
        alert('❌ Failed to post job: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Network error: Could not reach backend.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Post a New Job</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        <input
          name="salaryMin"
          placeholder="Minimum Salary"
          type="number"
          value={form.salaryMin}
          onChange={handleChange}
        />
        <input
          name="salaryMax"
          placeholder="Maximum Salary"
          type="number"
          value={form.salaryMax}
          onChange={handleChange}
        />
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
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Post Job
        </button>
      </form>
    </div>
  );
};

export default PostJobPage;
