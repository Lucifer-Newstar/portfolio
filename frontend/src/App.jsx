import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import PageThemeHandler from './components/PageThemeHandler'
import RouteMeta from './components/RouteMeta'
import PublicLayout from './components/layout/PublicLayout'
import AdminShell from './components/admin/AdminShell'
import PrivateWorkspace from './components/admin/PrivateWorkspace'

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
import PrivateHome from './pages/admin/PrivateHome'
import LuciferDashboard from './pages/admin/LuciferDashboard'
import LuciferSkills from './pages/admin/LuciferSkills'
import LuciferProjects from './pages/admin/LuciferProjects'
import LuciferPosts from './pages/admin/LuciferPosts'
import LuciferLearning from './pages/admin/LuciferLearning'
import LuciferWorkouts from './pages/admin/LuciferWorkouts'
import LuciferHobbies from './pages/admin/LuciferHobbies'

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
                <PrivateWorkspace />
              </ProtectedRoute>
            </AdminShell>
          }
        >
          <Route index element={<PrivateHome />} />
          <Route path="edit" element={<AdminDashboard />} />
          <Route path="lucifer/skills/*" element={<LuciferSkills />} />
          <Route path="lucifer/projects/*" element={<LuciferProjects />} />
          <Route path="lucifer/posts/*" element={<LuciferPosts />} />
          <Route path="lucifer/learning/*" element={<LuciferLearning />} />
          <Route path="lucifer/workouts/*" element={<LuciferWorkouts />} />
          <Route path="lucifer/hobbies/*" element={<LuciferHobbies />} />
          <Route path="lucifer/*" element={<LuciferDashboard />} />
        </Route>
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
