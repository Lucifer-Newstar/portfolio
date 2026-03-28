import { Link } from 'react-router-dom'

function Certifications() {
  const certifications = [
    {
      name: "Oracle Database @ AWS Certified Architect Professional",
      issuer: "Oracle",
      date: "Oct 2025",
      link: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=CA28460C14F975E596709C7D3B622CE567A942B04EF082EF61C6C213894FA234",
      skills: ["Oracle", "AWS", "Database"]
    },
    {
      name: "Oracle Cloud Infrastructure 2025 Certified Foundations Associate",
      issuer: "Oracle",
      date: "Oct 2025",
      link: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=3E5A5A8C90DB6F61272E7662EF777663C3316544D516C47E054F2357741AC09A",
      skills: ["OCI", "Cloud Fundamentals"]
    },
    {
      name: "AWS - Solutions Architecture Job Simulation",
      issuer: "Forage",
      date: "Oct 2025",
      link: "https://www.linkedin.com/posts/navin-jairam_forage-certificate-activity-7383053776896770048-CnHV",
      skills: ["AWS", "Solutions Architecture"]
    },
    {
      name: "30 Days Masterclass in Full Stack Development",
      issuer: "NoviTech",
      date: "Sep 2025",
      link: "https://www.linkedin.com/posts/navin-jairam_learningjourney-fullstackdevelopment-webdev-activity-7383070289804439552-7xV3",
      skills: ["Full Stack", "Web Development", "JavaScript"]
    }
  ]

  return (
    <div>
      <h1>Certifications</h1>
      <p>Professional certifications and credentials.</p>

      {certifications.map((cert, idx) => (
        <div key={idx}>
          <h2>{cert.name}</h2>
          <p><strong>Issuer:</strong> {cert.issuer}</p>
          <p><strong>Date:</strong> {cert.date}</p>
          <p>
            <a href={cert.link} target="_blank" rel="noopener noreferrer">
              View Credential →
            </a>
          </p>
          <div>
            <strong>Skills:</strong>
            <ul>
              {cert.skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </div>
          <hr />
        </div>
      ))}

      <div>
        <p>
          <Link to="/skills">View related skills</Link> |{' '}
          <Link to="/projects">See projects using these skills</Link> |{' '}
          <Link to="/posts">Read my posts</Link>
        </p>
      </div>
    </div>
  )
}

export default Certifications