import { useEffect, useState } from 'react';
import type { BlogCategory } from '../types';
import { blogCategoriesService } from '../services/blogCategoriesService';

export const useBlogCategories = () => {
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await blogCategoriesService.getAll();
                if (!isMounted) return;
                setCategories(data);
            } catch (e) {
                console.error(e);
                if (!isMounted) return;
                setError('Nie udało się pobrać kategorii.');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        void load();

        return () => {
            isMounted = false;
        };
    }, []);

    return { categories, loading, error };
};