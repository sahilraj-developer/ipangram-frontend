import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import './Department.css';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({ name: '', managerId: '' });
  const navigate = useNavigate()
  const userRole = localStorage.getItem('userRole');
  useEffect(() => {
    if(userRole !== "manager"){
        navigate('/home')
    }
  }, [userRole])


  const fetchDepartments = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/api/departments/alldepartment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };
  
  useEffect(() => {


    fetchDepartments();
  }, []);

  const handleAddDepartment = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/api/departments/create`, newDepartment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartments([...departments, response.data]);
      setNewDepartment({ name: '', managerId: '' });
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  const handleUpdateDepartment = async (id, updatedDepartment) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`${process.env.REACT_APP_URL}/api/departments/${id}`, updatedDepartment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartments(departments.map(dept => (dept.id === id ? response.data : dept)));
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  const handleDeleteDepartment = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.REACT_APP_URL}/api/departments/deletedepartment/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartments(departments.filter(dept => dept.id !== id));
      fetchDepartments()
      alert("Department Deleted SuccessFully")
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  return (
    <div className="department-container">
      <h1>Departments</h1>
      <div className="add-department-form">
        <h2>Add Department</h2>
        <input
          type="text"
          placeholder="Name"
          value={newDepartment.name}
          onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Manager ID"
          value={newDepartment.managerId}
          onChange={(e) => setNewDepartment({ ...newDepartment, managerId: e.target.value })}
        />
        <button onClick={handleAddDepartment}>Add Department</button>
      </div>
      <h2>Department List</h2>
      <ul>
        {departments.map((department) => (
          <li key={department.id}>
            {department.name} - Manager ID: {department.manager}
            <button onClick={() => handleUpdateDepartment(department._id, { ...department, name: 'Updated Name' })}>
              Update
            </button>
            <button onClick={() => handleDeleteDepartment(department._id)}>
              Delete 
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Department;
