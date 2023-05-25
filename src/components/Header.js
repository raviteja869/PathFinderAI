import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import your CSS file
import logo from '../images/logo.png'; // Import your logo
import userIcon from '../images/your-user-icon.png'; // Import your user icon

function Header() {
  return (
    <header className="header">
      <img src={logo} alt="PathFinderAI" className="logo" /> {/* Your platform's logo */}
      <input type="search" className="search-bar" placeholder="Search..." /> {/* Search bar */}
      <nav>
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
      <img src={userIcon} alt="User" className="user-icon" /> {/* User profile icon */}
    </header>
  );
}

export default Header;





