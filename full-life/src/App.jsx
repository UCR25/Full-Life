import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './welcome/landing'
import Login from './welcome/login'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
      </Routes>
    </Router>
  )
}

export default App
