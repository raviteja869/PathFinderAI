importimportimporimportimportimporimportimportimporimportimportimporimportimportimportimport React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './HandsOnProjects.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import AlgoliaRecommend from './AlgoliaRecommend';
import AIProjectDescriptionGenerator from './AIProjectDescriptionGenerator';

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

function HandsOnProjects() {
  const [userProfile, setUserProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [progress, setProgress] = useState({});
  const [customProjects, setCustomProjects] = useState([]);

  useEffect(() => {
    fetchUserProfileAndProgress();
  }, []);

  const fetchUserProfileAndProgress = async () => {
    const userDoc = doc(db, 'users', userProfile.id);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      setUserProfile(userData.profile);
      setProgress(userData.progress || {});
    } else {
      throw new Error('Failed to fetch user profile and progress');
    }
  };

  useEffect(() => {
    if (userProfile) {
      generateProjects(userProfile);
    }
  }, [userProfile]);

  const generateProjects = async (profile) => {
    const recommendedProjects = await AlgoliaRecommend(profile);
    const projectsWithDescriptions = await Promise.all(recommendedProjects.map(async (project) => {
      const description = await AIProjectDescriptionGenerator(project);
      return { ...project, description };
    }));
    setProjects(projectsWithDescriptions);
  };

  const addProject = (project) => {
    setCustomProjects(prevProjects => [...prevProjects, project]);
  };

  const removeProject = (project) => {
    setCustomProjects(prevProjects => prevProjects.filter(item => item !== project));
  };

  const handleProgressUpdate = async (project) => {
    setProgress(prevProgress => {
      const newProgress = {
        ...prevProgress,
        [project]: !prevProgress[project]
      };

      const userDoc = doc(db, 'users', userProfile.id);
      setDoc(userDoc, { progress: newProgress });

      return newProgress;
    });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      projects,
      result.source.index,
      result.destination.index
    );

    setProjects(items);
  };

  const progressPercentage = (Object.values(progress).filter(Boolean).length / projects.length) * 100;

  return (
    <><div className="hands-on-projects">
      <h2>Your Hands-On Projects</h2>
      <ProgressBar now={progressPercentage} label={`${Math.round(progressPercentage)}%`} />
      < />```jsx
      DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <ul {...provided.droppableProps} ref={provided.innerRef}>
            {projects.map((project, index) => (
              <Draggable key={project.id} draggableId={project.id} index={index}>
                {(provided) => (
                  <li
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className="draggable-item"
                  >
                    <input
                      type="checkbox"
                      checked={progress[project.id] || false}
                      onChange={() => handleProgressUpdate(project.id)} />
                    {project.name}
                    <p>{project.description}</p>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext><ul>
        {customProjects.map((project, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={progress[project] || false}
              onChange={() => handleProgressUpdate(project)} />
            {project}
            <button onClick={() => removeProject(project)}>Remove</button>
          </li>
        ))}
      </ul><button onClick={() => addProject('New Project')}>Add Project</button></>
    </div>
  );
}

export default HandsOnProjects;
