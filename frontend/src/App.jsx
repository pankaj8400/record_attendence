import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Toast from './components/Toast';
import { HiOutlineViewGrid, HiOutlineUsers, HiOutlineClipboardCheck } from 'react-icons/hi';

function App() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  return (
    <Router>
      <div className="app-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <h1>HRMS Lite</h1>
            <p>Human Resource Management</p>
          </div>
          <nav className="sidebar-nav">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon"><HiOutlineViewGrid /></span>
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/employees" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon"><HiOutlineUsers /></span>
              <span>Employees</span>
            </NavLink>
            <NavLink to="/attendance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon"><HiOutlineClipboardCheck /></span>
              <span>Attendance</span>
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees addToast={addToast} />} />
            <Route path="/attendance" element={<Attendance addToast={addToast} />} />
          </Routes>
        </main>

        {/* Toast Notifications */}
        <Toast toasts={toasts} />
      </div>
    </Router>
  );
}

export default App;
