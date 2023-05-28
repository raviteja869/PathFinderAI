import React, { useState, useEffect } from 'react';
import AlgoliaRecommend from 'algolia-recommend-js'; // Import AlgoliaRecommend

function CareerCoaching() {
  const [userProfile, setUserProfile] = useState(null);
  const [progress, setProgress] = useState({});
  const [coachingSessions, setCoachingSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    // Fetch user profile and progress data from your API
    fetch('/api/user-profile') 
      .then(response => response.json())
      .then(data => {
        setUserProfile(data.profile);
        setProgress(data.progress || {});
      })
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    if (userProfile) {
      const recommendedSessions = AlgoliaRecommend.recommendSessions(userProfile, progress);
      setCoachingSessions(recommendedSessions);
    }
  }, [userProfile, progress]);

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
  };

  const handleSessionCompletion = (session) => {
    // Update progress and user profile based on session completion
    setProgress(prevProgress => ({
      ...prevProgress,
      [session.id]: true
    }));
    setUserProfile(prevProfile => ({
      ...prevProfile,
      completedSessions: [...prevProfile.completedSessions, session.id]
    }));
  };

  const handleSessionFeedback = (session, feedback) => {
    // Send feedback to your API
    fetch('/api/session-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId: session.id, feedback }),
    })
    .then(response => response.json())
    .then(data => console.log('Feedback submitted successfully'))
    .catch(error => console.error('Error:', error));
  };

  return (
    <div className="career-coaching">
      <ul>
        {coachingSessions.map((session, index) => (
          <li key={index}>
            <h3>{session.title}</h3>
            <p>{session.description}</p>
            <button onClick={() => handleSessionSelect(session)}>View Details</button>
            <button onClick={() => handleSessionCompletion(session)}>Complete Session</button>
            <button onClick={() => handleSessionFeedback(session)}>Provide Feedback</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CareerCoaching;
