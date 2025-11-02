import { useState, useCallback } from 'react';

interface Session {
    isAdmin: boolean;
    login: (pin: string, correctPin: string) => boolean;
    logout: () => void;
}

export const useSession = (): Session => {
    const [isAdmin, setIsAdmin] = useState(false);

    const login = useCallback((pin: string, correctPin: string): boolean => {
        if (pin === correctPin) {
            setIsAdmin(true);
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        setIsAdmin(false);
    }, []);
    
    return { isAdmin, login, logout };
};
