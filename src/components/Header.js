import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Importing Header styles

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">PathFinderAi</Link> {/* Replace with your logo */}
      </div>
      <nav className="nav">
        <ul className="nav-links">
          <li><Link to="/career-plan">Career Plan</Link></li>
          <li><Link to="/mentor-match">Mentor Match</Link></li>
          <li><Link to="/goal-tracking">Goal Tracking</Link></li>
          <li><Link to="/skills-analysis">Skills Analysis</Link></li>
          <li><Link to="/job-application">Job Application</Link></li>
          <li><Link to="/interview-practice">Interview Practice</Link></li>
          <li><Link to="/career-change">Career Change</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
