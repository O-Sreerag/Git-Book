import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useUser } from '../contexts/userContext'

export default function UserPage() {
    const { username } = useParams()
    const { user, setUser} = useUser()
    const [repos, setRepos] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            if (!user || user.login !== username) {
                try {
                    const userResponse = await fetch(`https://api.github.com/users/${username}`)
                    const user = await userResponse.json()
                    setUser(user)
                } catch (error) {
                    console.error('Error fetching user data:', error)
                }
            }

            try {
                const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`)
                const reposData = await reposResponse.json()
                setRepos(reposData)
                console.log(reposData)
            } catch (error) {
                console.error('Error fetching repos:', error)
            }
        }

        fetchData()
    }, [username, user, setUser])

    if (!user) return <div>Loading...</div>

    return (
        <div className="user-page">
            <div className="user-info">
                <img src={user.avatar_url} alt={`${user.login}'s avatar`} />
                <h2>{user.name || user.login}</h2>
                <p>{user.bio}</p>
                <Link to={`/user/${username}/followers`}>Followers</Link>
            </div>

            <div className="dev-repos-grid">
                {repos.map((repo, index) => (
                    <div key={repo.name} className={`repo-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                        <div className="repo-icon">
                            <img src={user.avatar_url} alt={`${repo.name} icon`} className={`repo-img`}/>
                        </div>
                        <div className="repo-content">
                            <Link to={`/user/${username}/repo/${repo.name}`}>
                                <h3 className="repo-name">{repo.name} <span className="checkmark">✓</span></h3>
                            </Link>
                            <p className="repo-description">{repo.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}