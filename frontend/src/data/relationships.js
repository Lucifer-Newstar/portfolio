// Skill to related items mapping
export const skillRelations = {
  "AWS": {
    projects: ["project-portfolio"],
    certifications: ["cert-oci-foundations", "cert-aws-simulation"],
    experience: ["exp-intern-adroit"]
  },
  "Docker": {
    projects: ["project-portfolio"],
    certifications: [],
    experience: ["exp-intern-adroit", "exp-hackathon-lead"]
  },
  "Terraform": {
    projects: ["project-portfolio"],
    certifications: [],
    experience: []
  },
  "React": {
    projects: ["project-portfolio"],
    certifications: ["cert-fullstack"],
    experience: []
  },
  "OCI": {
    projects: [],
    certifications: ["cert-oci-foundations"],
    experience: []
  },
  "GitHub Actions": {
    projects: [],
    certifications: [],
    experience: ["exp-intern-adroit", "exp-hackathon-lead"]
  },
  "Python": {
    projects: [],
    certifications: [],
    experience: []
  },
  "JavaScript": {
    projects: ["project-portfolio"],
    certifications: ["cert-fullstack"],
    experience: []
  }
}

// Project to related items mapping
export const projectRelations = {
  "project-portfolio": {
    skills: ["React", "AWS", "Docker", "Terraform", "JavaScript"],
    certifications: ["cert-fullstack", "cert-aws-simulation"]
  }
}

// Certification to related items mapping
export const certificationRelations = {
  "cert-oci-foundations": {
    skills: ["OCI", "Cloud Fundamentals"],
    projects: []
  },
  "cert-aws-simulation": {
    skills: ["AWS", "Solutions Architecture"],
    projects: ["project-portfolio"]
  },
  "cert-fullstack": {
    skills: ["Full Stack", "JavaScript", "React"],
    projects: ["project-portfolio"]
  }
}

// Helper function to get item details by ID
export const getItemById = (type, id) => {
  // This will be populated from your actual data
  // For now, return placeholder
  return { id, name: id, title: id }
}