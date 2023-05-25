import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <h1>Hello, this is a test message!</h1>
        {/* other components */}
      </div>
    </Router>
  );
}

export default App;
