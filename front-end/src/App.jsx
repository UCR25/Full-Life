import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './welcome/landing'
import Login from './welcome/login'
import Signup from './welcome/signup'
import UserHomePage from './homepage/UserHomePage'

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-home" element={<UserHomePage />} /> */}
        <Route path="/" element={<UserHomePage />} />
      </Routes>
    </Router>
  )
}

export default App
