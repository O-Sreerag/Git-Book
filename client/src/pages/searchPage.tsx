import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/userContext'
import { useRepos } from '../contexts/reposContext'

export default function SearchPage() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()
  const { setUser} = useUser()
  const { setRepos } = useRepos()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:8080/user/${username}`)
      const userData = await response.json()
      setUser(userData.user)
      setRepos(userData.repos)
      navigate(`/user/${username}`)
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  return (
    <div className="search-page">
      <h1>GitHub User Explorer</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          required
        />
        <button type="submit">Search</button>
      </form>
    </div>
  )
}