import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [userRole, setUserRole] = useState('');
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', location: '', userId: '', departmentId: '' });
  const [filter, setFilter] = useState({ name: '', location: '' });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }

    const fetchEmployees = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/api/employees/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  useEffect(() => {
    if (token === null) {
      navigate('/login');
    }
  }, [token]);

  const handleAddEmployee = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/api/employees/create`, {
        name: newEmployee.name,
        location: newEmployee.location,
        userId: newEmployee.userId, // Add userId from state
        departmentId: newEmployee.departmentId, // Add departmentId from state
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees([...employees, response.data]);
      setFilteredEmployees([...employees, response.data]);
      setNewEmployee({ name: '', location: '', userId: '', departmentId: '' }); // Clear input fields
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleUpdateEmployee = async (id, updatedEmployee) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`${process.env.REACT_APP_URL}/api/employees/${id}`, updatedEmployee, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedEmployees = employees.map(emp => (emp.id === id ? response.data : emp));
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.REACT_APP_URL}/api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const remainingEmployees = employees.filter(emp => emp.id !== id);
      setEmployees(remainingEmployees);
      setFilteredEmployees(remainingEmployees);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
    filterEmployees({ ...filter, [name]: value });
  };

  const filterEmployees = (filters) => {
    const { name, location } = filters;
    const filteredList = employees.filter(employee =>
      employee?.name?.toLowerCase()?.includes(name?.toLowerCase()) &&
      employee?.location?.toLowerCase()?.includes(location?.toLowerCase())
    );
    setFilteredEmployees(filteredList);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    sortEmployees(key, direction);
  };

  const sortEmployees = (key, direction) => {
    const sortedEmployees = [...filteredEmployees].sort((a, b) => {
      if (direction === 'ascending') {
        return a[key]?.toLowerCase() > b[key]?.toLowerCase() ? 1 : -1;
      } else {
        return a[key]?.toLowerCase() < b[key]?.toLowerCase() ? 1 : -1;
      }
    });
    setFilteredEmployees(sortedEmployees);
  };

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  return (
    <div className="home-container">
      <h1>Home</h1>
      <span onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</span>
      {userRole === 'manager' && (
        <div className="add-employee-form">
          <h2>Add Employee</h2>
          <input
            type="text"
            placeholder="Name"
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Location"
            value={newEmployee.location}
            onChange={(e) => setNewEmployee({ ...newEmployee, location: e.target.value })}
          />
          <input
            type="text"
            placeholder="User ID"
            value={newEmployee.userId}
            onChange={(e) => setNewEmployee({ ...newEmployee, userId: e.target.value })}
          />
          <input
            type="text"
            placeholder="Department ID"
            value={newEmployee.departmentId}
            onChange={(e) => setNewEmployee({ ...newEmployee, departmentId: e.target.value })}
          />
          <button onClick={handleAddEmployee}>Add Employee</button>
        </div>
      )}
      <h2>Employee List</h2>
      <div className="filter-form">
        <input
          type="text"
          name="name"
          placeholder="Filter by Name"
          value={filter.name}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Filter by Location"
          value={filter.location}
          onChange={handleFilterChange}
        />
      </div>
      {filteredEmployees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('name')} className={getClassNamesFor('name')}>
                Name
                {getClassNamesFor('name') === 'ascending' && <span>&uarr;</span>}
                {getClassNamesFor('name') === 'descending' && <span>&darr;</span>}
              </th>
              <th onClick={() => requestSort('location')} className={getClassNamesFor('location')}>
                Location
                {getClassNamesFor('location') === 'ascending' && <span>&uarr;</span>}
                {getClassNamesFor('location') === 'descending' && <span>&darr;</span>}
              </th>
              {userRole === 'manager' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.location}</td>
                {userRole === 'manager' && (
                  <td>
                    <button disabled onClick={() => handleUpdateEmployee(employee.id, { ...employee, name: 'Updated Name' })}>
                      Update
                    </button>
                    <button disabled onClick={() => handleDeleteEmployee(employee.id)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Home;
