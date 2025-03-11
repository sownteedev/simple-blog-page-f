import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/admin" element={<AdminDashboard />} />
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
}

export default App;