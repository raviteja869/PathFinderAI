import React, { useEffect, useState } from 'react';

function CareerPlan() {
  const [careerPlan, setCareerPlan] = useState(null);

  useEffect(() => {
    fetch('/api/career-plan') // Replace with your actual API endpoint
      .then(response => response.json())
      .then(data => setCareerPlan(data));
  }, []);

  if (!careerPlan) {
    return <div>Loading...</div>;
  }

  return (
    <div className="career-plan">
      <h2>Your Career Plan</h2>
      <p>Current Position: {careerPlan.currentPosition}</p>
      <p>Desired Position: {careerPlan.desiredPosition}</p>
      <h3>Steps to Reach Your Goal:</h3>
      <ul>
        {careerPlan.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ul>
    </div>
  );
}

export default CareerPlan;
