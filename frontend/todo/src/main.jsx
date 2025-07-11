import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, Route, RouterProvider, createRoutesFromElements } from 'react-router-dom'
import Home from './components/Home/Home.jsx'
import Layout from './Layout.jsx'
import AuthLayout from './AuthLayout.jsx'
import LoginForm from './components/Auth/LoginForm.jsx'
import RegisterForm from './components/Auth/RegisterForm.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
  // <Route path='/' element={<Layout />}>
  //   <Route path='' element={<Home />} />
  //   <Route path='register' element={<RegisterForm />} />
  //   <Route path='login' element={<LoginForm />} />
  // </Route>
  <>
    <Route path='/' element={<Layout />}>
      <Route path='' element={<Home />} />
    </Route>
    <Route path='' element={<AuthLayout />}>
      <Route path='login' element={<LoginForm />} />
      <Route path='register' element={<RegisterForm />} />
    </Route>
  
  </>

))


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
