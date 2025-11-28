// TypeScript TSX
import React, { useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Props = {
    value?: string; // obecny URL obrazka (np. z DB)
    onChange: (url: string, meta?: { path: string }) => void; // ustaw URL w formularzu
    bucket?: string; // nazwa bucketa w Supabase
    maxSizeBytes?: number; // domyślnie 8MB
    label?: string;
    className?: string;
};

const DEFAULT_BUCKET = 'photos';

function getExt(file: File) {
    const n = file.name || '';
    const dot = n.lastIndexOf('.');
    return dot >= 0 ? n.slice(dot + 1).toLowerCase() : 'png';
}

function datePrefix() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}/${m}/${dd}`;
}


async function uploadToSupabase(file: File, bucket: string) {
    const ext = getExt(file);
    const id = crypto.randomUUID();
    const path = `${datePrefix()}/${id}.${ext}`;

    const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
            cacheControl: '604800',
            contentType: file.type,
            upsert: false,
        });

    if (error) throw error;

    // Zamiast getPublicUrl() użyj createSignedUrl()
    const { data, error: signError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 60 * 60 * 24 * 365); // 1 rok ważności

    if (signError || !data?.signedUrl) throw new Error('Nie udało się uzyskać URL z Supabase');

    return { publicUrl: data.signedUrl, path };
}

export function ImageUploadInput({
                                     value,
                                     onChange,
                                     bucket = DEFAULT_BUCKET,
                                     maxSizeBytes = 8 * 1024 * 1024,
                                     label = 'Obraz',
                                     className,
                                 }: Props) {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const chooseFile = () => fileRef.current?.click();

    const handleFile = async (file?: File | null) => {
        if (!file) return;
        setError(null);
        if (!file.type.startsWith('image/')) {
            setError('Dozwolone są tylko pliki graficzne.');
            return;
        }
        if (file.size > maxSizeBytes) {
            setError(`Plik jest zbyt duży. Limit: ${(maxSizeBytes / (1024 * 1024)).toFixed(0)} MB`);
            return;
        }
        setUploading(true);
        try {
            const { publicUrl, path } = await uploadToSupabase(file, bucket);
            onChange(publicUrl, { path });
        } catch (e: any) {
            setError(e?.message || 'Nie udało się wgrać obrazu');
        } finally {
            setUploading(false);
        }
    };

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        e.target.value = '';
        await handleFile(file);
    };

    const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        await handleFile(e.dataTransfer.files?.[0]);
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium mb-1">{label}</label>

            <div
                className={[
                    'rounded-md border border-dashed p-3 flex items-center gap-3',
                    'border-gray-300 dark:border-neutral-700',
                    'bg-white dark:bg-neutral-900',
                    'hover:border-gray-400 dark:hover:border-neutral-600',
                ].join(' ')}
                onDragOver={e => e.preventDefault()}
                onDrop={onDrop}
            >
                {value ? (
                    <>
                        <img
                            src={value}
                            alt="Podgląd"
                            className="h-20 w-20 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-700 dark:text-gray-200 truncate">
                                {value}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Przeciągnij plik, aby podmienić
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={chooseFile}
                            disabled={uploading}
                            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-neutral-700"
                        >
                            {uploading ? 'Wgrywanie…' : 'Zmień'}
                        </button>
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            disabled={uploading}
                            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-neutral-700"
                        >
                            Usuń
                        </button>
                    </>
                ) : (
                    <>
                        <div className="h-20 w-20 flex items-center justify-center rounded bg-gray-100 dark:bg-neutral-800 text-gray-400">
                            Brak
                        </div>
                        <div className="flex-1">
                            <div className="text-sm text-gray-700 dark:text-gray-200">
                                Przeciągnij i upuść obraz tutaj
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                lub
                                <button
                                    type="button"
                                    onClick={chooseFile}
                                    disabled={uploading}
                                    className="ml-1 underline"
                                >
                                    wybierz z dysku
                                </button>
                            </div>
                        </div>
                    </>
                )}

                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFileChange}
                />
            </div>

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Maks. {(maxSizeBytes / (1024 * 1024)).toFixed(0)} MB. Bucket: {bucket}
            </p>
        </div>
    );
}