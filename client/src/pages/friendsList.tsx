import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User } from '../interface/interface';
import { useUser } from '../contexts/userContext';
import { useRepos } from '../contexts/reposContext';
import { useNavigate } from 'react-router-dom';

export default function FriendsList() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [friends, setFriends] = useState<User[]>([]);
  const { setUser } = useUser();
  const { setRepos } = useRepos();
  const [loading, setLoading] = useState<boolean>(false);
  const [navigateTo, setNavigateTo] = useState<string | null>(null);

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

  const handleFriendClick = async (friend: User) => {
    setUser(friend);
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/user/${friend.username}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const userData = await response.json();
      setRepos(userData.repos);
      setNavigateTo(`/user/${friend.username}`);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigateTo) {
      navigate(navigateTo);
      setNavigateTo(null);
    }
  }, [navigateTo, navigate]);

  return (
    <div className="user-page">
      <h2>{username}'s Friends</h2>

      <div className="dev-repos-grid">
        {friends.length > 0 ? (
          friends.map((friend: User, index: number) => (
            <div key={friend.id} className={`repo-item ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="repo-icon">
                <img src={friend.avatar_url} alt={`${friend.username}'s avatar`} className="repo-img" />
              </div>
              <div className="repo-content">
                <div
                  onClick={() => handleFriendClick(friend)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3 className="repo-name">
                    {friend.name || friend.username} <span className="checkmark">✓</span>
                  </h3>
                </div>
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
