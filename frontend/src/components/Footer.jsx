function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} Navin Jairam. Built with React + AWS.</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          DevOps • Cloud • SRE
        </p>
      </div>
    </footer>
  )
}

export default Footer