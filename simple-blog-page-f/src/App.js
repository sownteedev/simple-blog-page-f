import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/TopnBot/Navbar';
import Hero from './components/HomePage/Hero';
import Projects from './components/HomePage/Projects';
import Team from './components/HomePage/Team';
import Blog from './components/Blog/Blog';
import BlogPost from './components/Blog/BlogPost';
import Contact from './components/HomePage/Contact';
import Footer from './components/TopnBot/Footer';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import AdminDashboard from './components/Admin/AdminDashboard';
import Create from './components/Post/Create';
import Edit from './components/Post/Edit';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected route for admin
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Private route for authenticated users
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route 
            path="/admin/new-post" 
            element={
              <AdminRoute>
                <Create />
              </AdminRoute>
            }
          />
          <Route 
            path="/admin/edit/:id" 
            element={
              <AdminRoute>
                <Edit />
              </AdminRoute>
            }
          />
          <Route path="/" element={
            <>
              <Hero />
              <Projects />
              <Team />
              <Contact />
            </>
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;