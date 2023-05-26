import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './PersonalizedLearningPath.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase configuration here
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

function PersonalizedLearningPath() {
  const [userProfile, setUserProfile] = useState(null);
  const [learningPath, setLearningPath] = useState([]);
  const [progress, setProgress] = useState({});
  const [error, setError] = useState(null); // New state to handle errors

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/user-profile');
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        setError('Failed to fetch user profile');
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userProfile) {
      const newPath = generateLearningPath(userProfile);
      setLearningPath(newPath);
    }
  }, [userProfile]);

  useEffect(() => {
    const fetchUserProfileAndProgress = async () => {
      try {
        const userDoc = doc(db, 'users', userProfile.id);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUserProfile(userData.profile);
          setProgress(userData.progress || {});
        } else {
          throw new Error('Failed to fetch user profile and progress');
        }
      } catch (error) {
        setError('Failed to fetch user profile and progress');
      }
    };

    fetchUserProfileAndProgress();
  }, []);

  const generateLearningPath = (profile) => {
    const { currentSkills, learningStyle } = profile;
    const learningPath = [];

    currentSkills.forEach(skill => {
      const resources = database[skill][learningStyle];
      learningPath.push(...resources);
    });

    return learningPath;
  };

  const handleProgressUpdate = async (resource) => {
   setProgress(prevProgress => {
      const newProgress = {
        ...prevProgress,
        [resource]: !prevProgress[resource] // Toggle completion status
      };

      // Save the new progress to the database
      const userDoc = doc(db, 'users', userProfile.id);
      setDoc(userDoc, { progress: newProgress });

      return newProgress;
    });
  };

  const [customLearningPath, setCustomLearningPath] = useState([]);

  const addResource = (resource) => {
    if (resource && !customLearningPath.includes(resource)) { // Check if the resource is valid and not already in the learning path
      setCustomLearningPath(prevPath => [...prevPath, resource]);
    } else {
      setError('Invalid resource');
    }
  };

  const removeResource = (resource) => {
    setCustomLearningPath(prevPath => prevPath.filter(item => item !== resource));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      learningPath,
      result.source.index,
      result.destination.index
    );

    setLearningPath(items);
  };

  const progressPercentage = learningPath.length > 0 ? (Object.values(progress).filter(Boolean).length / learningPath.length) * 100 : 0;

  return (
    <div className="personalized-learning-path">
      <h2>Your Personalized Learning Path</h2>
      {error && <p className="error">{error}</p>} {/* Display the error message if there is an error */}
      <ProgressBar now={progressPercentage} label={`${Math.round(progressPercentage)}%`} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {learningPath.map((resource, index) => (
                <Draggable key={resource} draggableId={resource} index={index}>
                  {(provided) => (
                    <li
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className="draggable-item"
                    >
                      <input
                        type="checkbox"
                        checked={progress[resource] || false}
                        onChange={() => handleProgressUpdate(resource)}
                      />
                      {resource}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <ul>
        {customLearningPath.map((resource, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={progress[resource] || false}
              onChange={() => handleProgressUpdate(resource)}
            />
            {resource}
            <button onClick={() => removeResource(resource)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={() => addResource('New Resource')}>Add Resource</button>
    </div>
  );
}

export default PersonalizedLearningPath;
