import React, { useState, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import InteractivePDF from './InteractivePDF'; // Import your InteractivePDF component
import Iframe from 'react-iframe';

function LabsForPractice() {
  const [userProfile, setUserProfile] = useState(null);
  const [labs, setLabs] = useState([]);
  const [progress, setProgress] = useState({});
  const [userCode, setUserCode] = useState(''); // New state to store user code

  // Fetch user profile and labs data from your API
  // Update progress when a lab is completed
  // ...

  // New function to handle "Save" button click
  const handleSave = () => {
    // Use postMessage API to send a message to the CodeSandbox iframe
    // requesting it to return the current code
    // ...
  };

  // New function to load user code into the CodeSandbox iframe
  const loadUserCode = () => {
    // Fetch the saved code from your database
    // Use postMessage API to send a message to the CodeSandbox iframe
    // instructing it to load the fetched code
    // ...
  };

  useEffect(() => {
    // Add an event listener to listen for the response from the CodeSandbox iframe
    window.addEventListener('message', (event) => {
      // Check the origin of the message
      if (event.origin !== 'https://codesandbox.io') {
        return;
      }

      // Check the format of the message data
      if (typeof event.data !== 'string') {
        return;
      }

      // Save the returned code to your database
      setUserCode(event.data);
    });

    // Load user code when the component is rendered
    loadUserCode();

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('message', handleSave);
    };
  }, []);

  return (
    <div className="labs-for-practiceSure, here is the continuation of the code:


    <h2>Your Labs for Practice</h2>
    <div className="lab-content">
      <div className="interactive-pdf">
        <PDFViewer>
          <InteractivePDF />
        </PDFViewer>
      </div>
      <div className="code-editor">
        <Iframe url="https://codesandbox.io/embed/new"
          width="100%"
          height="500px"
          id="myId"
          className="myClassname"
          display="initial"
          position="relative"
          allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
          sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
        />
        <button onClick={handleSave}>Save</button> {/* Add a "Save" button */}
      </div>
    </div>
  </div>
  );
}

export default LabsForPractice;

