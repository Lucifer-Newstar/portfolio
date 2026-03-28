import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

// Public pages
import Home from './pages/public/Home'
import About from './pages/public/About'
import Experience from './pages/public/Experience'
import Skills from './pages/public/Skills'
import Projects from './pages/public/Projects'
import Certifications from './pages/public/Certifications'
import Posts from './pages/public/Posts'
import Contact from './pages/public/Contact'
import Callback from './pages/public/Callback'

// Admin page
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/callback" element={<Callback />} />
            
            {/* Protected Admin Route - Hidden */}
            <Route 
              path="/lucifer-newstar_dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App