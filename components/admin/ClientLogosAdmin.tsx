
import React, { useEffect, useState } from 'react';
import { Upload, X } from 'lucide-react';
import type { ClientLogo } from '../../types';
import { clientLogosService } from '../../services/clientLogosService';

const emptyForm: Omit<ClientLogo, 'id' | 'created_at' | 'updated_at'> = {
    name: '',
    logo_url: '',
    order: 0,
    is_active: true,
};

const ClientLogosAdmin: React.FC = () => {
    const [items, setItems] = useState<ClientLogo[]>([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<typeof emptyForm>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const load = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await clientLogosService.getAll({ includeInactive: true });
            setItems(data);
        } catch (e) {
            console.error(e);
            setError('Nie udało się pobrać listy logów klientów.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setError(null);
            setUploadProgress(0);

            // Validacja na froncie
            const allowedTypes = ['image/png', 'image/svg+xml', 'image/jpeg'];
            if (!allowedTypes.includes(file.type)) {
                setError('Niedozwolony format pliku. Dozwolone: PNG, SVG, JPG');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError('Plik jest za duży. Maksymalny rozmiar to 5MB.');
                return;
            }

            // Pokaż podgląd
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewUrl(event.target?.result as string);
            };
            reader.readAsDataURL(file);

            // Wrzuć plik
            setUploadProgress(50);
            const logoUrl = await clientLogosService.uploadFile(file);
            setUploadProgress(100);

            setForm(f => ({ ...f, logo_url: logoUrl }));

            // Resetuj input
            e.target.value = '';
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'Nie udało się wrzucić pliku.');
            setPreviewUrl(null);
        } finally {
            setUploadProgress(0);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.logo_url) {
            setError('Wybierz plik loga.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            if (editingId) {
                await clientLogosService.update(editingId, form);
            } else {
                await clientLogosService.create(form);
            }

            setForm(emptyForm);
            setEditingId(null);
            setPreviewUrl(null);
            await load();
        } catch (e) {
            console.error(e);
            setError('Nie udało się zapisać zmian.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: ClientLogo) => {
        setEditingId(item.id);
        setForm({
            name: item.name,
            logo_url: item.logo_url,
            order: item.order,
            is_active: item.is_active,
        });
        setPreviewUrl(item.logo_url);
    };

    const handleDelete = async (id: string, logoUrl: string) => {
        if (!window.confirm('Na pewno usunąć ten logo klienta?')) return;
        try {
            setLoading(true);
            await clientLogosService.delete(id, logoUrl);
            await load();
        } catch (e) {
            console.error(e);
            setError('Nie udało się usunąć logo.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setForm(emptyForm);
        setPreviewUrl(null);
        setError(null);
    };

    return (
        <div className="grid lg:grid-cols-[2fr_3fr] gap-10">
            {/* Formularz */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold mb-2 dark:text-white">
                    {editingId ? 'Edytuj logo klienta' : 'Dodaj nowe logo klienta'}
                </h2>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-neutral-200">Nazwa firmy</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-transparent text-sm"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-3 dark:text-neutral-200">
                        Logo <span className="text-xs text-gray-500">(PNG, SVG, JPG - max 5MB)</span>
                    </label>

                    {/* Podgląd */}
                    {previewUrl && (
                        <div className="mb-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-md flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="h-10 w-10 object-contain"
                                />
                                <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                    {form.logo_url.split('/').pop()}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setPreviewUrl(null);
                                    setForm(f => ({ ...f, logo_url: '' }));
                                }}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}

                    {/* Upload */}
                    {!previewUrl && (
                        <label className="flex items-center justify-center gap-2 px-3 py-6 border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition">
                            <Upload size={20} className="text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Kliknij aby wybrać plik
                            </span>
                            <input
                                type="file"
                                accept=".png,.svg,.jpg,.jpeg"
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={loading || uploadProgress > 0}
                            />
                        </label>
                    )}

                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-2">
                            <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-neutral-200">Kolejność</label>
                    <input
                        type="number"
                        value={form.order}
                        onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-transparent text-sm"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        id="is_active"
                        type="checkbox"
                        checked={form.is_active}
                        onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                        className="w-4 h-4"
                    />
                    <label htmlFor="is_active" className="text-sm dark:text-neutral-200">
                        Aktywne (widoczne na stronie)
                    </label>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading || uploadProgress > 0}
                        className="px-4 py-2 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold disabled:opacity-60"
                    >
                        {editingId ? 'Zapisz zmiany' : 'Dodaj'}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 rounded-md border border-gray-300 dark:border-neutral-700 text-sm"
                        >
                            Anuluj
                        </button>
                    )}
                </div>
            </form>

            {/* Lista */}
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Lista logów klientów</h2>

                {loading && items.length === 0 && (
                    <p className="text-sm text-gray-500">Ładowanie...</p>
                )}

                {items.length === 0 && !loading && (
                    <p className="text-sm text-gray-500">Brak logów klientów. Dodaj pierwszego powyżej.</p>
                )}

                <ul className="space-y-3">
                    {items.map(item => (
                        <li
                            key={item.id}
                            className="flex items-center justify-between gap-4 px-3 py-2 rounded-md border border-gray-200 dark:border-neutral-800"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <img
                                    src={item.logo_url}
                                    alt={item.name}
                                    className="h-10 w-10 object-contain flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold dark:text-neutral-50">
                                            {item.name}
                                        </span>
                                        {!item.is_active && (
                                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200">
                                                ukryte
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-1">
                                        Kolejność: {item.order}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2 flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => handleEdit(item)}
                                    className="px-2 py-1 text-xs rounded-md border border-gray-300 dark:border-neutral-700"
                                >
                                    Edytuj
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(item.id, item.logo_url)}
                                    className="px-2 py-1 text-xs rounded-md bg-red-500 text-white"
                                >
                                    Usuń
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ClientLogosAdmin;