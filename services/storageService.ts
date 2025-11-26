import { supabase } from '../lib/supabaseClient';

const BUCKET = 'photos'; // dostosuj do swojej nazwy

function getExt(file: File) {
    const name = file.name || '';
    const dot = name.lastIndexOf('.');
    return dot >= 0 ? name.slice(dot + 1).toLowerCase() : '';
}

function datePrefix() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}/${m}/${dd}`;
}

export async function uploadImageToStorage(file: File) {
    if (!file) throw new Error('Brak pliku');
    if (!file.type.startsWith('image/')) throw new Error('Dozwolone są tylko obrazy');
    if (file.size > 8 * 1024 * 1024) throw new Error('Plik jest zbyt duży (limit 8MB)');

    const ext = getExt(file) || 'png';
    const id = crypto.randomUUID();
    const path = `${datePrefix()}/${id}.${ext}`;

    const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, {
            cacheControl: '3600',
            contentType: file.type,
            upsert: false,
        });

    if (upErr) throw upErr;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    if (!data?.publicUrl) throw new Error('Nie udało się uzyskać URL');

    return { publicUrl: data.publicUrl, path };
}
