import { useEffect, useState } from 'react';
import type { TestimonialItem } from '../types';
import { testimonialsService } from '../services/testimonialsService';

export const useTestimonials = () => {
    const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await testimonialsService.getAll();
                if (!isMounted) return;
                setTestimonials(data);
            } catch (e) {
                console.error(e);
                if (!isMounted) return;
                setError('Nie udało się pobrać listy opinii.');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        void load();

        return () => {
            isMounted = false;
        };
    }, []);

    return { testimonials, loading, error };
};