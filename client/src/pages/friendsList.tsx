import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function FriendsList() {
  const { username } = useParams()
  const [friends, setFriends] = useState([])

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}/followers`)
        const data = await response.json()
        setFriends(data)
        console.log(friends)
      } catch (error) {
        console.error('Error fetching friends:', error)
      }
    }

    fetchFriends()
  }, [username])

  return (
    <div className="friends-list">
      <h2>{username}'s Friends</h2>
      <ul>
        {friends.map((follower) => (
          <li key={follower.id}>
            <Link to={`/user/${follower.login}`}>
              <img src={follower.avatar_url} alt={`${follower.login}'s avatar`} />
              {follower.login}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}