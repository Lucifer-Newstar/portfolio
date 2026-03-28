import { Link } from 'react-router-dom'

function Experience() {
  const experiences = [
    {
      title: "DevOps & Cloud Deployment Lead",
      organization: "SIH25029 - Meenakshi College Of Engineering",
      period: "Sep 2025 - Nov 2025",
      location: "KK Nagar West, Chennai",
      description: [
        "Led DevOps and cloud deployment for college hackathon team",
        "Managed team roles and ensured smooth collaboration",
        "Guided team to excel in project delivery",
        "Implemented CI/CD pipelines and containerized solutions"
      ],
      skills: ["Docker", "GitHub Actions", "AWS", "Team Leadership"]
    },
    {
      title: "Software Deployment Intern",
      organization: "Adroit Technologies Innovative Solutions Pvt. Ltd.",
      period: "Dec 2025 - Feb 2026",
      location: "Chennai",
      description: [
        "Worked on software deployment and automation",
        "Gained hands-on experience with DevOps practices",
        "Collaborated with team on deployment strategies"
      ],
      skills: ["Deployment", "Automation", "DevOps", "Team Collaboration"]
    }
  ]

  return (
    <div>
      <h1>Experience</h1>
      <p>My professional journey in DevOps, Cloud, and leadership.</p>

      {experiences.map((exp, idx) => (
        <div key={idx}>
          <h2>{exp.title}</h2>
          <h3>{exp.organization}</h3>
          <p>{exp.period} | {exp.location}</p>
          <ul>
            {exp.description.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <div>
            <strong>Skills used:</strong>
            <ul>
              {exp.skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </div>
          <hr />
        </div>
      ))}

      <div>
        <p>
          <Link to="/skills">View my skills</Link> |{' '}
          <Link to="/projects">See my projects</Link> |{' '}
          <Link to="/certifications">Check certifications</Link>
        </p>
      </div>
    </div>
  )
}

export default Experience