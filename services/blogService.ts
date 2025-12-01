
import type { BlogPost } from '../types';
import { supabase } from '../lib/supabaseClient';

function toSlug(title: string) {
    return title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '');
}

interface BlogPostRow {
    id?: string; // Zmienione na opcjonalne
    created_at?: string;
    title: string;
    short_description?: string | null;
    content?: string | null;
    img_url?: string | null;
    tag?: string | null;
    slug: string;
    order?: number;
}

function mapRowToBlogPost(row: BlogPostRow): BlogPost {
    if (!row.id) {
        throw new Error('Post musi mieć ID');
    }
    return {
        id: row.id,
        title: row.title,
        summary: row.short_description ?? '',
        slug: row.slug,
        content: row.content ?? '',
        img_url: row.img_url ?? undefined,
        category: row.tag ?? '',
        order: row.order ?? 0,
    };
}

export const blogService = {
    // Pobierz wszystkie posty (sortuj po order)
    async getPosts(): Promise<BlogPost[]> {
        const { data, error } = await supabase
            .from('Posts')
            .select('id,created_at,title,short_description,content,img_url,tag,slug,order')
            .order('order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Błąd getPosts:', error);
            return [];
        }

        return (data ?? [])
            .filter((row) => !!row.id)
            .map((row) => mapRowToBlogPost(row));
    },

    // Pobierz wszystkie posty (stara metoda, dla kompatybilności)
    async getAllPosts(): Promise<BlogPost[]> {
        return this.getPosts();
    },

    // Pobierz pojedynczy post po slug
    async getPostBySlug(slug: string): Promise<BlogPost | null> {
        const { data, error } = await supabase
            .from('Posts')
            .select('id,created_at,title,short_description,content,img_url,tag,slug,order')
            .eq('slug', slug)
            .maybeSingle();

        if (error) {
            console.error('Błąd getPostBySlug:', error);
            return null;
        }

        if (!data || !data.id) {
            return null;
        }

        return mapRowToBlogPost(data as BlogPostRow);
    },

    // Dodaj nowy post
    async addPost(post: Omit<BlogPost, 'slug' | 'id' | 'created_at'>): Promise<BlogPost | null> {
        const title = (post as any).title as string | undefined;
        if (!title) {
            console.error('addPost: wymagany tytuł');
            return null;
        }

        const newSlug = toSlug(title);

        const { data: existing, error: checkErr } = await supabase
            .from('Posts')
            .select('slug')
            .eq('slug', newSlug)
            .limit(1);

        if (checkErr) {
            console.error('Błąd sprawdzania duplikatu slug:', checkErr);
            return null;
        }
        if (existing && existing.length > 0) {
            alert('Post o takim tytule (i slugu) już istnieje. Zmień tytuł.');
            return null;
        }

        const payload = {
            slug: newSlug,
            title,
            short_description: post.summary ?? null,
            content: post.content ?? null,
            img_url: post.img_url ?? null,
            tag: post.category ?? null,
            order: 0,
        };

        const { data, error } = await supabase
            .from('Posts')
            .insert(payload)
            .select('id,created_at,title,short_description,content,img_url,tag,slug,order')
            .single();

        if (error) {
            console.error('Błąd addPost:', error);
            return null;
        }

        if (!data || !data.id) {
            console.error('addPost: odpowiedź bez ID');
            return null;
        }

        return mapRowToBlogPost(data as BlogPostRow);
    },

    // Aktualizacja post
    async updatePost(slug: string, updatedPost: Partial<BlogPost>): Promise<boolean> {
        const { error } = await supabase
            .from('Posts')
            .update({
                title: (updatedPost as any).title ?? undefined,
                short_description: (updatedPost as any).summary ?? undefined,
                content: (updatedPost as any).content ?? undefined,
                img_url: (updatedPost as any).img_url ?? undefined,
                tag: (updatedPost as any).category ?? undefined,
                order: (updatedPost as any).order ?? undefined,
            })
            .eq('slug', slug);

        if (error) {
            console.error('Błąd updatePost:', error);
            return false;
        }
        return true;
    },

    // Usuwanie post
    async deletePost(slug: string): Promise<boolean> {
        const { error } = await supabase
            .from('Posts')
            .delete()
            .eq('slug', slug);

        if (error) {
            console.error('Błąd deletePost:', error);
            return false;
        }
        return true;
    },

    // Aktualizuj kolejność postu
    async updatePostOrder(postId: string, order: number): Promise<boolean> {
        if (!postId) {
            console.error('updatePostOrder: brak ID postu');
            return false;
        }

        const { error } = await supabase
            .from('Posts')
            .update({ order })
            .eq('id', postId);

        if (error) {
            console.error('Błąd updatePostOrder:', error);
            return false;
        }
        return true;
    },
};