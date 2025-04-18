import { useState } from 'react'
import Calendar from "./components/Calendar.jsx"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
	<Calendar />
      <h1>Full-Life</h1>
      <p> hello! </p>
    </>
  )
}

export default App
