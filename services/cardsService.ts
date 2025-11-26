import { supabase } from '../lib/supabaseClient';
import type { CardItem } from '../types';

const TABLE_NAME = 'cards';

export const cardsService = {
    async getAll(options?: { includeInactive?: boolean }): Promise<CardItem[]> {
        const query = supabase
            .from(TABLE_NAME)
            .select('*')
            .order('order', { ascending: true });

        if (!options?.includeInactive) {
            query.eq('is_active', true);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching services:', error);
            throw error;
        }

        return (data ?? []) as CardItem[];
    },

    async getById(id: string): Promise<CardItem | null> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching service by id:', error);
            throw error;
        }

        return data as CardItem | null;
    },

    async create(payload: Omit<CardItem, 'id' | 'created_at' | 'updated_at'>) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert(payload)
            .select()
            .single();

        if (error) {
            console.error('Error creating service:', error);
            throw error;
        }

        return data as CardItem;
    },

    async update(id: string, payload: Partial<Omit<CardItem, 'id'>>) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({
                ...payload,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating service:', error);
            throw error;
        }

        return data as CardItem;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting service:', error);
            throw error;
        }
    },
};