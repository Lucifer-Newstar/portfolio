import { Link } from 'react-router-dom'

function Skills() {
  const skillCategories = [
    {
      name: "Cloud Platforms",
      skills: [
        { name: "AWS (EC2, S3, RDS)", tag: "aws" },
        { name: "Oracle Cloud Infrastructure (OCI)", tag: "oci" }
      ]
    },
    {
      name: "DevOps & CI/CD",
      skills: [
        { name: "Docker", tag: "docker" },
        { name: "Kubernetes", tag: "kubernetes" },
        { name: "GitHub Actions", tag: "github-actions" }
      ]
    },
    {
      name: "Infrastructure as Code",
      skills: [
        { name: "Terraform", tag: "terraform" },
        { name: "Ansible (Learning)", tag: "ansible" }
      ]
    },
    {
      name: "Monitoring",
      skills: [
        { name: "Prometheus (Learning)", tag: "prometheus" },
        { name: "Grafana (Learning)", tag: "grafana" }
      ]
    },
    {
      name: "Programming",
      skills: [
        { name: "Python", tag: "python" },
        { name: "Bash", tag: "bash" },
        { name: "JavaScript", tag: "javascript" }
      ]
    },
    {
      name: "Databases",
      skills: [
        { name: "PostgreSQL", tag: "postgresql" },
        { name: "MongoDB", tag: "mongodb" }
      ]
    },
    {
      name: "AI & ML",
      skills: [
        { name: "Tesseract OCR", tag: "tesseract" },
        { name: "Prompt Engineering", tag: "prompt-engineering" }
      ]
    },
    {
      name: "Other Tools",
      skills: [
        { name: "Git", tag: "git" },
        { name: "Linux Fundamentals", tag: "linux" },
        { name: "Networking Concepts", tag: "networking" },
        { name: "Full Stack Development", tag: "fullstack" }
      ]
    }
  ]

  return (
    <div>
      <h1>Skills & Technologies</h1>
      <p>Here's what I'm learning and building with.</p>

      {skillCategories.map((category, idx) => (
        <div key={idx}>
          <h2>{category.name}</h2>
          <ul>
            {category.skills.map((skill, skillIdx) => (
              <li key={skillIdx}>
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <hr />
      <div>
        <p>
          <Link to="/projects">Browse my projects</Link> |{' '}
          <Link to="/experience">See my experience</Link> |{' '}
          <Link to="/certifications">View certifications</Link>
        </p>
      </div>
    </div>
  )
}

export default Skills