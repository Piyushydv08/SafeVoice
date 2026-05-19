import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export const useNetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            toast.success("You are back online!", { id: 'network-status' });
        };

        const handleOffline = () => {
            setIsOnline(false);
            toast.error("You are offline. Some features may not work.", {
                id: 'network-status',
                duration: Infinity
            });
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
};