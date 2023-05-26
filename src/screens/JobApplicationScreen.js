import React, { useState, useEffect } from 'react';
import Pagination from 'react-js-pagination'; // You need to install this package
import { ShareButtons } from 'react-share'; // You need to install this package
import { ToastContainer, toast } from 'react-toastify'; // You need to install this package
import 'react-toastify/dist/ReactToastify.css'; // You need to install this package

function JobApplication() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [application, setApplication] = useState({
    coverLetter: '',
    resume: '',
  });
  const [activePage, setActivePage] = useState(1);
  const [jobsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    fetch('/api/jobs') // Replace with your actual API endpoint
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        return response.json();
      })
      .then(data => {
        setJobs(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error);
        setIsLoading(false);
      });
  }, []);

  const handleJobSelect = (job) => {
    setSelectedJob(job);
  };

  const handleInputChange = (event) => {
    setApplication({
      ...application,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Send the application to the API...
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSaveJob = (job) => {
    setSavedJobs([...savedJobs, job]);
  };

  const handleShareJob = (job) => {
    // Share job on social media...
  };

  const handleJobNotification = () => {
    toast('New job posted!');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }


  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastJob = activePage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <div className="job-application">
      <h2>Job Application</h2>
      <input
        type="text"
        placeholder="Search jobs..."
        value={search}
        onChange={handleSearchChange}
      />
      <div className="job-list">
        {currentJobs.map((job, index) => (
          <div key={index} className="job" onClick={() => handleJobSelect(job)}>
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <button onClick={() => handleSaveJob(job)}>Save Job</button>
            <button onClick={() => handleShareJob(job)}>Share Job</button>
          </div>
        ))}
      </div>
      <Pagination
        activePage={activePage}
        itemsCountPerPage={jobsPerPage}
        totalItemsCount={filteredJobs.length}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
      />
      {selectedJob && (
        <div className="job-details">
          <h3>{selectedJob.title}</h3>
          <p>{selectedJob.description}</p>
          <form onSubmit={handleSubmit}>
            <label>
              Cover Letter:
              <textarea name="coverLetter" value={application.coverLetter} onChange={handleInputChange} />
            </label>
            <label>
              Resume:
              <textarea name="resume" value={application.resume} onChange={handleInputChange} />
            </label>
            <button type="submit">Apply</button>
          </form>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default JobApplication;
