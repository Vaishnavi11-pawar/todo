import React, {useEffect, useState} from 'react'
import {Outlet} from 'react-router-dom'
import './styles/layout.css'
import Navbar from './components/Layout/Navbar'

function Layout() {
  const [username, setUsername] = useState('');
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className='layout'>
      <Navbar username={username} />
      <Outlet />
      
    </div>
  )
}

export default Layout