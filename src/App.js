import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Mission from './components/Mission';
import Projects from './components/Projects';
import Team from './components/Team';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';

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