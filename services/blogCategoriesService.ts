
import { supabase } from '../lib/supabaseClient';
import type { BlogCategory } from '../types';

const TABLE_NAME = 'blog_categories';

export const blogCategoriesService = {
    async getAll(): Promise<BlogCategory[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching blog categories:', error);
            throw error;
        }

        return (data ?? []) as BlogCategory[];
    },

    async getById(id: string): Promise<BlogCategory | null> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching blog category by id:', error);
            throw error;
        }

        return data as BlogCategory | null;
    },

    async create(payload: Omit<BlogCategory, 'id'>) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert(payload)
            .select()
            .single();

        if (error) {
            console.error('Error creating blog category:', error);
            throw error;
        }

        return data as BlogCategory;
    },

    async update(id: string, payload: Partial<Omit<BlogCategory, 'id'>>) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update(payload)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating blog category:', error);
            throw error;
        }

        return data as BlogCategory;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting blog category:', error);
            throw error;
        }
    },
};