import { useState, useCallback } from 'react';

export type Page = 
    | 'home'
    | 'pricing'
    | 'recording'
    | 'description'
    | 'payment'
    | 'generating'
    | 'playback'
    | 'instrumentals'
    | 'express'
    | 'contact-info'
    | 'trending'
    | 'admin-login'
    | 'admin'
    | 'creators-studio'
    | 'ceo-testing';

interface KioskState {
    currentPage: Page;
    previousPage: Page;
    navigate: (page: Page) => void;
    goBack: () => void;
}

export const useKioskState = (initialPage: Page = 'home'): KioskState => {
    const [currentPage, setCurrentPage] = useState<Page>(initialPage);
    const [previousPage, setPreviousPage] = useState<Page>(initialPage);

    const navigate = useCallback((page: Page) => {
        setPreviousPage(currentPage);
        setCurrentPage(page);
    }, [currentPage]);

    const goBack = useCallback(() => {
        setCurrentPage(previousPage);
    }, [previousPage]);

    return { currentPage, previousPage, navigate, goBack };
};