import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './welcome/landing'
import Login from './welcome/login'
import UserHomePage from './homepage/UserHomePage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup/>} />
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-home" element={<UserHomePage />} />
      </Routes>
    </Router>
  )
}

export default App
