import React, { createContext, useState, ReactNode, useContext } from 'react';
import { User } from '../interface/interface';

interface userContextProps {
    user: User | null;
    setUser: (key: any | null) => void;
}

const UserContext = createContext<userContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): userContextProps => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within an UserProvider');
    }
    return context;
};
