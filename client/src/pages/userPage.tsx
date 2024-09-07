import { Link, useParams } from 'react-router-dom'
import { useUser } from '../contexts/userContext'
import { useRepos } from '../contexts/reposContext'
import { Repo } from '../interface/interface'
import RepoDetails from './repoDetails'
import { useState } from 'react'

export default function UserPage() {
    const [selectedRepo, setSelectedRepo] = useState<Repo | null>()
    const { username } = useParams()
    const { user } = useUser()
    const { repos } = useRepos()
    
    if (!user) return <div>Loading...</div>
    return (
        <div className="user-page">
            <div className="user-info">
                <img src={user?.avatar_url} alt={`${user.username}'s avatar`} />
                <h2>{user.name || user.username}</h2>
                <p>{user.bio}</p>
                <Link to={`/user/${username}/friends`}>Friends</Link>
            </div>

            {
                selectedRepo == null ? (
                    <div className="dev-repos-grid">
                        {repos && repos.length > 1 && repos.map((repo: Repo, index: number) => (
                            <div key={repo.name} className={`repo-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                                <div className="repo-icon">
                                    <img src={user.avatar_url} alt={`${repo.name} icon`} className={`repo-img`} />
                                </div>
                                <div className="repo-content">
                                    <button onClick={() => setSelectedRepo(repo)}>
                                        <h3 className="repo-name">{repo.name} <span className="checkmark">✓</span></h3>
                                    </button>
                                    <p className="repo-description">{repo.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <RepoDetails repoData={selectedRepo} />
                )
            }
        </div>
    )
}