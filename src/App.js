import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './pages/Home';
import Department from './pages/Department';
import './App.css';

const App = () => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')

  return (
    <Router>
      <div>
        {token !==null &&
 <nav>
 <ul>
   <li><Link to="/">Home</Link></li>
   {userRole === "manager" &&
       <li><Link to="/department">Departments</Link></li>
   }

 </ul>
</nav>
        }
       
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/department" element={<Department />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
