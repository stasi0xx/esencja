import { useEffect, useState } from 'react';
import type { ServiceItem } from '../types';
import { servicesService } from '../services/servicesService';

export const useServices = () => {
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await servicesService.getAll();
                if (!isMounted) return;
                setServices(data);
            } catch (e) {
                console.error(e);
                if (!isMounted) return;
                setError('Nie udało się pobrać listy usług.');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        void load();

        return () => {
            isMounted = false;
        };
    }, []);

    return { services, loading, error };
};