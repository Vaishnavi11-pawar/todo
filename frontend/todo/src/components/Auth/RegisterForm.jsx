import React from 'react'
import axios from 'axios';
import '../../styles/registerform.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
    const [formData, setFormdata] = useState({ fullname:'', username:'', email:'', password:'' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormdata(prev => ({
            ...prev, [e.target.name]: e.target.value
        }));
    }
    const handleRegister = async(e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
           const res = await axios.post('api/v1/register', formData);
           console.log("Registration successfull: ", res.data);
           setSuccess('user register successfully.'); 
           navigate('/login'); 
           setFormdata({ fullname:'', username:'', email:'', password:'' });   
        } catch (error) {
            console.log('Registration failed: ', error);
            const errormsg = error.response?.data?.message || "something went wrong";
            setError(errormsg)

        }
    }
  return (
    <form onSubmit={handleRegister} className='form-group'>
        <h2>Register</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <input type="text" name="fullname" placeholder='Fullname' value={formData.fullname} onChange={handleChange} required />
        <input type="text" name="username" placeholder='Username' value={formData.username} onChange={handleChange} required />
        <input type="email" name="email" placeholder='Email' value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder='Password' value={formData.password} onChange={handleChange} required />
        <button type='submit'>Register</button>
    </form>
  )
}

export default RegisterForm