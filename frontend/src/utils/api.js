const API_BASE_URL = "https://6e2n1oy6k9.execute-api.us-east-1.amazonaws.com/prod"

const fetchAPI = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    const result = await response.json()
    // Handle both direct array and wrapped response
    if (result.body) {
      return JSON.parse(result.body)
    }
    return result
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    return []
  }
}

export const fetchSkills = async () => fetchAPI('/skills')
export const fetchProjects = async () => fetchAPI('/projects')
export const fetchExperience = async () => fetchAPI('/experience')
export const fetchCertifications = async () => fetchAPI('/certifications')