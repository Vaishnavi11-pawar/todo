import React from 'react'
import { Outlet } from 'react-router-dom'
import './styles/authlayout.css'

function AuthLayout() {
  return (
    <div className='auth-layout'>
      <Outlet />
    </div>
  )
}

export default AuthLayout