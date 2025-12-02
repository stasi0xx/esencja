import React, { useEffect, useState } from 'react';
import type { BlogCategory } from '../../types';
import { blogCategoriesService } from '../../services/blogCategoriesService';

const emptyForm: Omit<BlogCategory, 'id'> = {
    name: '',
    slug: '',
};

const BlogCategoriesAdmin: React.FC = () => {
    const [items, setItems] = useState<BlogCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<typeof emptyForm>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await blogCategoriesService.getAll();
            setItems(data);
        } catch (e) {
            console.error(e);
            setError('Nie udało się pobrać listy kategorii.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleNameChange = (name: string) => {
        setForm(f => ({
            ...f,
            name,
            slug: generateSlug(name),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            if (editingId) {
                await blogCategoriesService.update(editingId, form);
            } else {
                await blogCategoriesService.create(form);
            }

            setForm(emptyForm);
            setEditingId(null);
            await load();
        } catch (e) {
            console.error(e);
            setError('Nie udało się zapisać zmian.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: BlogCategory) => {
        setEditingId(item.id);
        setForm({
            name: item.name,
            slug: item.slug,
        });
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Na pewno usunąć tę kategorię?')) return;
        try {
            setLoading(true);
            await blogCategoriesService.delete(id);
            await load();
        } catch (e) {
            console.error(e);
            setError('Nie udało się usunąć kategorii.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid lg:grid-cols-[2fr_3fr] gap-10">
            {/* Formularz */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold mb-2 dark:text-white">
                    {editingId ? 'Edytuj kategorię' : 'Dodaj nową kategorię'}
                </h2>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-neutral-200">Nazwa</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={e => handleNameChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-transparent text-sm"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-neutral-200">Slug (URL)</label>
                    <input
                        type="text"
                        value={form.slug}
                        onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-transparent text-sm"
                        required
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold disabled:opacity-60"
                    >
                        {editingId ? 'Zapisz zmiany' : 'Dodaj'}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingId(null);
                                setForm(emptyForm);
                            }}
                            className="px-4 py-2 rounded-md border border-gray-300 dark:border-neutral-700 text-sm"
                        >
                            Anuluj
                        </button>
                    )}
                </div>
            </form>

            {/* Lista */}
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Lista kategorii</h2>

                {loading && items.length === 0 && (
                    <p className="text-sm text-gray-500">Ładowanie...</p>
                )}

                {items.length === 0 && !loading && (
                    <p className="text-sm text-gray-500">Brak kategorii. Dodaj pierwszą powyżej.</p>
                )}

                <ul className="space-y-3">
                    {items.map(item => (
                        <li
                            key={item.id}
                            className="flex items-center justify-between gap-4 px-3 py-2 rounded-md border border-gray-200 dark:border-neutral-800"
                        >
                            <div>
                                <span className="text-sm font-semibold dark:text-neutral-50">
                                    {item.name}
                                </span>
                                <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                                    Slug: <code className="bg-gray-100 dark:bg-neutral-800 px-1 py-0.5 rounded">{item.slug}</code>
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleEdit(item)}
                                    className="px-2 py-1 text-xs rounded-md border border-gray-300 dark:border-neutral-700"
                                >
                                    Edytuj
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(item.id)}
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

export default BlogCategoriesAdmin;