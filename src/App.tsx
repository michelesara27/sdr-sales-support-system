import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DatabaseProvider } from './contexts/DatabaseContext';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Conversation from './pages/Conversation';
import Admin from './pages/Admin';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  return (
    <DatabaseProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/conversation" element={<Conversation />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
        </div>
      </Router>
    </DatabaseProvider>
  );
}

export default App;
