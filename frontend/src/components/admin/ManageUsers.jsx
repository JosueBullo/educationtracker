import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav2 from '../Nav2';
import Footer from '../Footer';
import './css/ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users with 'user' role
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/auth/get-all-users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users.');
      }
    };

    fetchUsers();
  }, []);

  // Delete user by ID
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/auth/delete-user/${id}`);
      setUsers(users.filter(user => user._id !== id));
      toast.success('User deleted successfully.');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user.');
    }
  };

  // Show confirmation dialog before deleting
  const confirmDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
    }
  };

  // Define columns for DataTable
  const columns = [
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    { name: 'Grade Level', selector: row => row.gradeLevel, sortable: true },
    { name: 'Role', selector: row => row.role, sortable: true },
    { name: 'Status', selector: row => (row.isActive ? 'Active' : 'Disabled'), sortable: true },
    {
      name: 'Actions',
      cell: row => (
        <>
          <button onClick={() => confirmDelete(row._id)} className="action-button delete">Delete</button>
        
        </>
      ),
    },
  ];

  // Define custom styles for the DataTable
  const customStyles = {
    headCells: {
      style: {
        fontSize: '20px', // Increase font size
        fontWeight: 'bold', // Make text bold
        padding: '10px', // Add padding for spacing
        textAlign: 'center', // Center-align text
        backgroundColor: '#f2f2f2', // Light gray background color
        borderBottom: '2px solid #ddd', // Bottom border for separation
      },
    },
  };

  return (
    <>
      <Nav2 />
      <div className="manage-users-wrapper">
      <div className="manage-users-container">
      <h1 className="manage-users-title">Manage Users</h1>
      
        <DataTable
          className="data-table"
          columns={columns}
          data={users}
          pagination
          highlightOnHover
          responsive
          customStyles={customStyles}
        />
        <ToastContainer />
      </div>
      </div>
      <Footer />
    </>
  );
};

export default ManageUsers;