import type { BlogPost } from '../types';
import { supabase } from '../lib/supabaseClient';

// Pomocnicza funkcja do budowy sluga
function toSlug(title: string) {
    return title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '');
}

type DbPost = {
    id: number;
    created_at: string;
    title: string | null;
    short_description: string | null;
    content: string | null;
    img_url: string | null;
    tag: string | null;
    slug: string | null;
};

// Uwaga: jeśli Twój BlogPost ma camelCase (np. shortDescription, imgUrl),
// możesz tu zrobić mapowanie. Poniżej zwracam bezpośrednio pola z bazy (snake_case),
// co jest najprostsze i bezpieczne typowo.
export const blogService = {
    // Pobierz wszystkie posty (najnowsze na górze)
    async getPosts(): Promise<BlogPost[]> {
        const { data, error } = await supabase
            .from('Posts') // ważne: wielka litera jak w schemacie
            .select('id,created_at,title,short_description,content,img_url,tag,slug')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Błąd getPosts:', error);
            return [];
        }

        return (data ?? []) as unknown as BlogPost[];
    },

    // Pobierz pojedynczy post po slug
    async getPostBySlug(slug: string): Promise<BlogPost | null> {
        const { data, error } = await supabase
            .from('Posts')
            .select('id,created_at,title,short_description,content,img_url,tag,slug')
            .eq('slug', slug)
            .maybeSingle();

        if (error) {
            console.error('Błąd getPostBySlug:', error);
            return null;
        }

        return (data as unknown as BlogPost) ?? null;
    },

    // Dodaj nowy post – slug z tytułu
    async addPost(post: Omit<BlogPost, 'slug' | 'id' | 'created_at'>): Promise<BlogPost | null> {
        // Zakładam, że post.title istnieje
        const title = (post as any).title as string | undefined;
        if (!title) {
            console.error('addPost: wymagany tytuł');
            return null;
        }

        const newSlug = toSlug(title);

        // Opcjonalnie: sprawdzenie duplikatu sluga (brak unikalności w schemacie)
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
            short_description: (post as any).short_description ?? null,
            content: (post as any).content ?? null,
            img_url: (post as any).img_url ?? null,
            tag: (post as any).tag ?? null,
            // created_at wypełni się automatycznie w bazie
        };

        const { data, error } = await supabase
            .from('Posts')
            .insert(payload)
            .select('id,created_at,title,short_description,content,img_url,tag,slug')
            .single();

        if (error) {
            console.error('Błąd addPost:', error);
            return null;
        }

        return data as unknown as BlogPost;
    },

    // (Opcjonalnie) Aktualizacja po slug
    async updatePost(slug: string, updatedPost: Partial<BlogPost>): Promise<boolean> {
        const { error } = await supabase
            .from('Posts')
            .update({
                title: (updatedPost as any).title ?? undefined,
                short_description: (updatedPost as any).short_description ?? undefined,
                content: (updatedPost as any).content ?? undefined,
                img_url: (updatedPost as any).img_url ?? undefined,
                tag: (updatedPost as any).tag ?? undefined,
            })
            .eq('slug', slug);

        if (error) {
            console.error('Błąd updatePost:', error);
            return false;
        }
        return true;
    },

    // (Opcjonalnie) Usuwanie po slug
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
};