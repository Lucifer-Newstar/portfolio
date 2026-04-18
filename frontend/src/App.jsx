import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import PageThemeHandler from './components/PageThemeHandler'
import RouteMeta from './components/RouteMeta'
import PublicLayout from './components/layout/PublicLayout'
import AdminShell from './components/admin/AdminShell'

// Public pages
import HomeProfessional from './pages/public/HomeProfessional'
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

function AppFrame() {
  return (
    <>
      <PageThemeHandler />
      <RouteMeta />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomeProfessional />} />
          <Route path="/about" element={<About />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/devops-lab" element={<DevOpsLab />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/callback" element={<Callback />} />
        </Route>

        <Route
          path="/lucifer-newstar_dashboard"
          element={
            <AdminShell>
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            </AdminShell>
          }
        />
      </Routes>
    </>
  )
}

function App() {
  return (
    <Router>
      <AppFrame />
    </Router>
  )
}

export default App
