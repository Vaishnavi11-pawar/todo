import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../../styles/navbar.css'

function Navbar({username}) {
    const navigate = useNavigate();
    const handleLogout= () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    }
  return (
    <div className='navbar'>
        <div className='navbar-left'>
            <h3>Welcome, {username}!</h3>
        </div>
        <div className='navbar-center'>
            <p>This is your ToDo</p>
        </div>
        <div className='navbar-right'>
            <button className='logout-btn' onClick={handleLogout}>Logout</button>
        </div>
    </div>
  )
}

export default Navbar