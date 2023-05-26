import React, { useState } from 'react';
import AIJobInterviewCoach from 'ai-job-interview-coach'; // Import the AI Job Interview Coach

function InterviewPractice() {
  const [selectedInterview, setSelectedInterview] = useState(null);

  const handleInterviewSelect = (interview) => {
    setSelectedInterview(interview);
  };

  const handleFeedbackReceived = (feedback) => {
    // Handle the feedback received from the AI
  };

  return (
    <div className="interview-practice">
      <h2>Interview Practice</h2>
      <div className="interview-list">
        {/* List of interviews for the user to select */}
      </div>
      {selectedInterview && (
        <div className="interview-details">
          <h3>{selectedInterview.title}</h3>
          {/* More details about the selected interview */}
          <AIJobInterviewCoach
            interview={selectedInterview}
            onFeedbackReceived={handleFeedbackReceived}
          />
        </div>
      )}
    </div>
  );
}

export default InterviewPractice;
