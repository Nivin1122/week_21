import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import SuperuserProtectedRoute from './components/SuperuserProtectedRoute';
import EditUser from './components/EditUser';
import UserProfile from './components/UserProfile';
import { resetAdmin } from './slices/adminSlice'; 
import { resetuserprofile } from './slices/userprofileSlice';
import { resetUser } from './slices/userSlice';

function Logout() {
  // resetUser()
  // resetuserprofile()
  localStorage.clear()
  return <Navigate to="/login"/>
}

function AdminLogout() {
  // resetAdmin()
  localStorage.clear()
  return <Navigate to="/adminlogin"/>
}

function RegisterAndLogout(){
  localStorage.clear()
  return <Register/>
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Home/>
             </ProtectedRoute>
          }
        />
        <Route path='/userprofile' element={<UserProfile/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path="/logout" element={<Logout />} />
        <Route path="/AdminLogout" element={<AdminLogout/>} />

        <Route path='/register' element={<RegisterAndLogout/>}/>
        <Route path='*' element={<NotFound/>}>  </Route>  
        <Route path='/adminlogin' element={<AdminLogin/>}/>
        <Route path="/login" element={<Login />} />
        

        <Route 
                path="/admindashboard" 
                element={
                    <SuperuserProtectedRoute>
                        <AdminDashboard />
                    </SuperuserProtectedRoute>
                } 
            />

        <Route path="/edit-user/:userId" element={
            <SuperuserProtectedRoute>
            <EditUser />
            </SuperuserProtectedRoute>
          } />


      </Routes>
      
    </BrowserRouter>
  )
}

export default App
