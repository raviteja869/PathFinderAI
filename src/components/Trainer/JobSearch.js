import React, { useState, useEffect } from 'react';
import AlgoliaRecommend from 'algolia-recommend-js'; // Import AlgoliaRecommend
import Pagination from 'react-js-pagination'; // You need to install this package
import { ShareButtons } from 'react-share'; // You need to install this package
import { ToastContainer, toast } from 'react-toastify'; // You need to install this package
import 'react-toastify/dist/ReactToastify.css'; // You need to install this package

function JobSearch() {
  const [userProfile, setUserProfile] = useState(null);
  const [progress, setProgress] = useState({});
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const jobsPerPage = 10;

  useEffect(() => {
    // Fetch user profile and progress data from your API
    // Replace with your actual API endpoint
    fetch('/api/user-profile') 
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        return response.json();
      })
      .then(data => {
        setUserProfile(data.profile);
        setProgress(data.progress || {});
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (userProfile) {
      // Generate recommended jobs based on the user's profile and progress
      const recommendedJobs = AlgoliaRecommend.recommendJobs(userProfile, progress);
      setJobs(recommendedJobs);
    }
  }, [userProfile, progress]);

  const handleJobSelect = (job) => {
    setSelectedJob(job);
  };

  const handleSaveJob = (job) => {
    setSavedJobs(prevJobs => [...prevJobs, job]);
  };

  const handleShareJob = (job) => {
    // Implement your job sharing logic here
    if (navigator.share) {
    navigator.share({
      title: job.title,
      text: job.description,
      url: job.url, // The URL of the job posting
    })
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing', error));
  } else {
    console.log('Share not supported on this browser, do it manually.');
  }
  };

  const handleApplyJob = (job, application) => {
    // Implement your job application logic here
    // Redirect the user to the job application URL
    
    window.location.href = job.applyUrl;
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
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
  const [currentPage, setCurrentPage] = useState(1);

const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
  // Then fetch jobs for the new page...
};


  return (
    <div className="job-search">
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search jobs..."
      />
      <ul>
        {currentJobs.map((job, index) => (
          <li key={index}>
```jsx
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <button onClick={() => handleJobSelect(job)}>View Details</button>
            <button onClick={() => handleSaveJob(job)}>Save Job</button>
            <button onClick={() => handleShareJob(job)}>Share Job</button>
            <button onClick={() => handleApplyJob(job)}>Apply</button>
          </li>
        ))}
      </ul>
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
          <form onSubmit={handleApplyJob}>
            <label>
              Cover Letter:
              <textarea name="coverLetter" onChange={handleInputChange} />
            </label>
            <label>
              Resume:
              <textarea name="resume" onChange={handleInputChange} />
            </label>
            <button type="submit">Apply</button>
          </form>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default JobSearch;
