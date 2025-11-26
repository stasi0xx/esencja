import { useEffect, useState } from 'react';
import type { CardItem } from '../types';
import { cardsService } from '../services/cardsService';

export const useCards = () => {
    const [cards, setCards] = useState<CardItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await cardsService.getAll();
                if (!isMounted) return;
                setCards(data);
            } catch (e) {
                console.error(e);
                if (!isMounted) return;
                setError('Nie udało się pobrać kart.');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        void load();

        return () => {
            isMounted = false;
        };
    }, []);

    return { cards, loading, error };
};