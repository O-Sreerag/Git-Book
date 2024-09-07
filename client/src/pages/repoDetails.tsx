import { useUser } from '../contexts/userContext';
import { Repo } from '../interface/interface';

interface RepoDetailsProps {
    repoData: Repo;
}

export default function RepoDetails({ repoData }: RepoDetailsProps) {
    if (!repoData) return <div>Loading...</div>;
    const { user } = useUser()

    return (
        <div>
            <div className="app-card">
                <div className="app-icon">
                    <img 
                        src={user?.avatar_url || "/placeholder.svg"} 
                        alt={`${repoData.name} logo`} 
                        width="80" 
                        height="80" 
                    />
                </div>
                <div className="app-content">
                    <div className="app-header">
                        <span className="app-type">Repository</span>
                        <h1 className="app-title">{repoData.full_name}</h1>
                        <button className="setup-button">
                            Star Count: {repoData.stargazers_count | 0}
                        </button>
                    </div>
                    <div className="app-description">
                        <p><strong>{repoData.name}</strong></p>
                        <p>{repoData.description || "No description available."}</p>
                        <p>Language: {repoData.language || "Not specified"}</p>
                        <p>Forks: {repoData.forks_count | 0}</p>
                        <p>Open Issues: {repoData.open_issues_count | 0}</p>
                    </div>
                </div>
                <div className="app-sidebar">
                    <div className="owner-info">
                        <h3>Owner</h3>
                        <p>{user?.username}</p>
                        <a 
                            href={`https://github.com/${user?.username}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            GitHub Profile
                        </a>
                    </div>
                    <div className="repo-links">
                        <h3>Repository Links</h3>
                        <a 
                            href={repoData.html_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            View on GitHub
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
