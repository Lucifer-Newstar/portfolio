import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollAnimations from './components/ScrollAnimations'
import ProtectedRoute from './components/ProtectedRoute'
import PageThemeHandler from './components/PageThemeHandler'
import ParticleBackground from './components/ParticleBackground'
import ThemeAtmosphere from './components/ThemeAtmosphere'
import Breadcrumbs from './components/Breadcrumbs'
import ScrollProgress from './components/ScrollProgress'
import InteractionEffects from './components/InteractionEffects'

// Public pages
import Home from './pages/public/Home'
import About from './pages/public/About'
import Experience from './pages/public/Experience'
import Skills from './pages/public/Skills'
import Projects from './pages/public/Projects'
import DevOpsLab from './pages/public/DevOpsLab'
import Certifications from './pages/public/Certifications'
import Posts from './pages/public/Posts'
import Contact from './pages/public/Contact'
import Callback from './pages/public/Callback'

// Admin page
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  return (
    <Router>
      <PageThemeHandler />
      <ParticleBackground />
      <ThemeAtmosphere />
      <InteractionEffects />
      <ScrollAnimations />
      <ScrollProgress />
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Breadcrumbs />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/devops-lab" element={<DevOpsLab />} />
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
