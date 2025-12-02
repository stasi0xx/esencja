
import { supabase } from '../lib/supabaseClient';
import type { ClientLogo } from '../types';

const TABLE_NAME = 'client_logos';
const STORAGE_BUCKET = 'client_logos';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/svg+xml', 'image/jpeg'];

export const clientLogosService = {
    async getAll(options?: { includeInactive?: boolean }): Promise<ClientLogo[]> {
        let query = supabase
            .from(TABLE_NAME)
            .select('*')
            .order('order', { ascending: true });

        if (!options?.includeInactive) {
            query = query.eq('is_active', true);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching client logos:', error);
            throw error;
        }

        return (data ?? []) as ClientLogo[];
    },

    async getById(id: string): Promise<ClientLogo | null> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching client logo by id:', error);
            throw error;
        }

        return data as ClientLogo | null;
    },

    async uploadFile(file: File): Promise<string> {
        // Validacja rozmiaru
        if (file.size > MAX_FILE_SIZE) {
            throw new Error(`Plik jest za duży. Maksymalny rozmiar to 5MB.`);
        }

        // Validacja typu
        if (!ALLOWED_TYPES.includes(file.type)) {
            throw new Error('Niedozwolony format pliku. Dozwolone: PNG, SVG, JPG');
        }

        const fileExt = file.name.split('.').pop()?.toLowerCase();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(fileName, file);

        if (uploadError) {
            console.error('Error uploading file:', uploadError);
            throw new Error('Nie udało się wrzucić pliku.');
        }

        // Pobierz publiczny URL
        const { data: publicUrlData } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(fileName);

        return publicUrlData.publicUrl;
    },

    async deleteFile(logoUrl: string): Promise<void> {
        // Wyodrębnij nazwę pliku z URL
        const fileName = logoUrl.split('/').pop();
        if (!fileName) return;

        const { error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([fileName]);

        if (error) {
            console.error('Error deleting file:', error);
            throw new Error('Nie udało się usunąć pliku.');
        }
    },

    async create(payload: Omit<ClientLogo, 'id' | 'created_at' | 'updated_at'>) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert({
                id: crypto.randomUUID(), // ← DODAJ TO
                ...payload,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating client logo:', error);
            throw error;
        }

        return data as ClientLogo;
    },

    async update(id: string, payload: Partial<Omit<ClientLogo, 'id'>>) {
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
            console.error('Error updating client logo:', error);
            throw error;
        }

        return data as ClientLogo;
    },

    async delete(id: string, logoUrl: string) {
        // Najpierw usuń plik z storage
        await this.deleteFile(logoUrl);

        // Potem usuń rekord z bazy
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting client logo:', error);
            throw error;
        }
    },
};