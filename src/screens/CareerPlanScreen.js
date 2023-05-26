import React, { useEffect, useState } from 'react';
import './CareerPlan.css'; // Import your CSS file

function CareerPlan() {
  const [careerPlan, setCareerPlan] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    currentPosition: '',
    desiredPosition: '',
    steps: '',
  });

  useEffect(() => {
    fetch('/api/career-plan') // Replace with your actual API endpoint
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch career plan');
        }
        return response.json();
      })
      .then(data => {
        setCareerPlan(data);
        setEditForm(data);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  const handleInputChange = (event) => {
    setEditForm({
      ...editForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!editForm.currentPosition || !editForm.desiredPosition || !editForm.steps) {
      alert('Please fill out all fields.');
      return;
    }

    fetch('/api/career-plan', { // Replace with your actual API endpoint
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editForm),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update career plan');
        }
        return response.json();
      })
      .then(data => {
        setCareerPlan(data);
        setIsEditing(false);
      })
      .catch(error => console.error('Error:', error));
  };

  if (!careerPlan) {
    return <div>Loading...</div>;
  }

  if (isEditing) {
    return (
      <div className="career-plan">
        <h2>Edit Your Career Plan</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Current Position:
            <input type="text" name="currentPosition" value={editForm.currentPosition} onChange={handleInputChange} required />
          </label>
          <label>
            Desired Position:
            <input type="text" name="desiredPosition" value={editForm.desiredPosition} onChange={handleInputChange} required />
          </label>
          <label>
            Steps:
            <textarea name="steps" value={editForm.steps} onChange={handleInputChange} required />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      </div>
    );
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
      <button onClick={() => setIsEditing(true)}>Edit</button>
    </div>
  );
}

export default CareerPlan;
