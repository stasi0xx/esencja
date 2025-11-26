import { supabase } from '../lib/supabaseClient';
import type { ServiceItem } from '../types';

const TABLE_NAME = 'services';

export const servicesService = {
    async getAll(options?: { includeInactive?: boolean }): Promise<ServiceItem[]> {
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

        return (data ?? []) as ServiceItem[];
    },

    async getById(id: string): Promise<ServiceItem | null> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching service by id:', error);
            throw error;
        }

        return data as ServiceItem | null;
    },

    async create(payload: Omit<ServiceItem, 'id' | 'created_at' | 'updated_at'>) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert(payload)
            .select()
            .single();

        if (error) {
            console.error('Error creating service:', error);
            throw error;
        }

        return data as ServiceItem;
    },

    async update(id: string, payload: Partial<Omit<ServiceItem, 'id'>>) {
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

        return data as ServiceItem;
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