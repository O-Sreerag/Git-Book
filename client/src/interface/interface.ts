export interface User {
    id: number;
    username: string;
    name?: string;
    avatar_url?: string;
    location?: string;
    blog?: string;
    bio?: string;
    publicRepos?: number;
    publicGists?: number;
    followers?: number;
    following?: number;
    createdAt?: Date;
    deletedAt?: Date | null;
}

export interface Repo {
    full_name: string;
    name: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    language: string | null;
    owner: User;
    html_url: string;
}

