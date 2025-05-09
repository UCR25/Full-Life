import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './screen/landing'
import Signup from "./signup/signup"

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="/signup" element={<Signup/>} />
      </Routes>
    </Router>
  )
}

export default App
