import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar'
import PublicFooter from '../PublicFooter'
import Breadcrumbs from '../Breadcrumbs'
import ScrollProgress from '../ScrollProgress'

function PublicLayout() {
  useEffect(() => {
    document.body.setAttribute('data-ui-surface', 'public')

    return () => {
      document.body.removeAttribute('data-ui-surface')
    }
  }, [])

  return (
    <div className="app-shell app-shell-public">
      <Navbar />
      <main className="app-main app-main-public">
        <ScrollProgress />
        <Breadcrumbs />
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}

export default PublicLayout
