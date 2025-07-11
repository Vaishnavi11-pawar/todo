import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import '../../styles/loginform.css';


function LoginForm() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/v1/login', { email, password });
      const accessToken = response.data?.data?.accessToken;
      const username = response.data?.data?.user?.username;
      console.log("username: ", username);
      
      if(accessToken) {
        localStorage.setItem('token', accessToken);
        localStorage.setItem('username', username);
        console.log("logged in successfully");
        navigate('/');
      }
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  }

  return (

    <form onSubmit={handleLogin}>
            <div className="form-group">
                <h2>Login</h2>
                <input id="email" type="email" placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
                <p>Don't have an account? <a href="/register">Register</a></p>
            </div>
    </form>
  )
}

export default LoginForm