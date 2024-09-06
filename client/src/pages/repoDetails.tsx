import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function RepoDetails() {
  const { username, repoName } = useParams()
  const [repoData, setRepoData] = useState(null)

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`)
        const data = await response.json()
        setRepoData(data)
        console.log(repoData)
      } catch (error) {
        console.error('Error fetching repo data:', error)
      }
    }

    fetchRepoData()
  }, [username, repoName])

  if (!repoData) return <div>Loading...</div>

  return (
    <div className="repo-details">
      <h2>{repoData.name}</h2>
      <p>{repoData.description}</p>
      <p>Stars: {repoData.stargazers_count}</p>
      <p>Forks: {repoData.forks_count}</p>
      <p>Language: {repoData.language}</p>
    </div>
  )
}