import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import ImageUpload from './pages/ImageUpload.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/upload" element={<ImageUpload />} />
      </Routes>
    </Router>
  )
}

export default App 