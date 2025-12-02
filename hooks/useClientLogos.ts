import { useEffect, useState } from 'react';
import type { ClientLogo } from '../types';
import { clientLogosService } from '../services/clientLogosService';

export const useClientLogos = () => {
    const [logos, setLogos] = useState<ClientLogo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await clientLogosService.getAll();
                if (!isMounted) return;
                setLogos(data);
            } catch (e) {
                console.error(e);
                if (!isMounted) return;
                setError('Nie udało się pobrać logoów.');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        void load();

        return () => {
            isMounted = false;
        };
    }, []);

    return { logos, loading, error };
};