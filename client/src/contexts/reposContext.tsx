import React, { createContext, useState, ReactNode, useContext } from 'react';
import { Repo } from '../interface/interface';

interface reposContextProps {
    repos: Repo[] | null;
    setRepos: (key: Repo[] | null) => void;
}

const ReposContext = createContext<reposContextProps | undefined>(undefined);

export const ReposProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [repos, setRepos] = useState<Repo[] | null>(null);

    return (
        <ReposContext.Provider value={{ repos, setRepos }}>
            {children}
        </ReposContext.Provider>
    );
};

export const useRepos = (): reposContextProps => {
    const context = useContext(ReposContext);
    if (!context) {
        throw new Error('useRepos must be used within an RepoProvider');
    }
    return context;
};
