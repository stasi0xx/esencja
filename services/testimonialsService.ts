
import { supabase } from '../lib/supabaseClient';
import type { TestimonialItem } from '../types';

const TABLE_NAME = 'testimonials';

export const testimonialsService = {
    async getAll(options?: { includeInactive?: boolean }): Promise<TestimonialItem[]> {
        const query = supabase
            .from(TABLE_NAME)
            .select('*')
            .order('order', { ascending: true });

        if (!options?.includeInactive) {
            query.eq('is_active', true);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching testimonials:', error);
            throw error;
        }

        return (data ?? []) as TestimonialItem[];
    },

    async getById(id: string): Promise<TestimonialItem | null> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching testimonial by id:', error);
            throw error;
        }

        return data as TestimonialItem | null;
    },

    async create(payload: Omit<TestimonialItem, 'id' | 'created_at' | 'updated_at'>) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert(payload)
            .select()
            .single();

        if (error) {
            console.error('Error creating testimonial:', error);
            throw error;
        }

        return data as TestimonialItem;
    },

    async update(id: string, payload: Partial<Omit<TestimonialItem, 'id'>>) {
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
            console.error('Error updating testimonial:', error);
            throw error;
        }

        return data as TestimonialItem;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting testimonial:', error);
            throw error;
        }
    },
};