import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/userContext'

export default function SearchPage() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()
  const { user, setUser} = useUser()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`https://api.github.com/users/${username}`)
      const userData = await response.json()
      setUser(userData)
      console.log(userData)
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