import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { User } from '../interface/interface';

export default function FriendsList() {
  const { username } = useParams()
  const [friends, setFriends] = useState([])

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/${username}/friends`);
        const data = await response.json();
        setFriends(data.friends);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, [username]);

  return (
    <div className="user-page">
      <h2>{username}'s Friends</h2>
      
      <div className="dev-repos-grid">
        {friends && friends.length > 0 ? (
          friends.map((friend: User, index: number) => (
            <div key={friend.id} className={`repo-item ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="repo-icon">
                <img src={friend.avatar_url} alt={`${friend.username}'s avatar`} className="repo-img" />
              </div>
              <div className="repo-content">
                <Link to={`/user/${friend.username}`}>
                  <h3 className="repo-name">
                    {friend.name || friend.username} <span className="checkmark">✓</span>
                  </h3>
                </Link>
                <p className="repo-description">{friend.bio || "No bio available"}</p>
                <p>Followers: {friend.followers} | Following: {friend.following}</p>
                <p>Public Repositories: {friend.publicRepos}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No friends found.</p>
        )}
      </div>
    </div>
  );
}