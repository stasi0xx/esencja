import React, { useEffect, useState } from 'react';
import type { ServiceItem } from '../../types';
import { servicesService } from '../../services/servicesService';

const emptyForm: Omit<ServiceItem, 'id' | 'created_at' | 'updated_at'> = {
    title: '',
    description: '',
    icon: '',
    order: 0,
    is_active: true,
};

const ServicesAdmin: React.FC = () => {
    const [items, setItems] = useState<ServiceItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<typeof emptyForm>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await servicesService.getAll({ includeInactive: true });
            setItems(data);
        } catch (e) {
            console.error(e);
            setError('Nie udało się pobrać listy usług.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            if (editingId) {
                await servicesService.update(editingId, form);
            } else {
                await servicesService.create(form);
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

    const handleEdit = (item: ServiceItem) => {
        setEditingId(item.id);
        setForm({
            title: item.title,
            description: item.description,
            icon: item.icon ?? '',
            order: item.order,
            is_active: item.is_active,
        });
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Na pewno usunąć tę usługę?')) return;
        try {
            setLoading(true);
            await servicesService.delete(id);
            await load();
        } catch (e) {
            console.error(e);
            setError('Nie udało się usunąć elementu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid lg:grid-cols-[2fr_3fr] gap-10">
            {/* Formularz */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold mb-2 dark:text-white">
                    {editingId ? 'Edytuj usługę' : 'Dodaj nową usługę'}
                </h2>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-neutral-200">Tytuł</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-transparent text-sm"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-neutral-200">Opis</label>
                    <textarea
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-transparent text-sm min-h-[80px]"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-neutral-200">Ikona (np. nazwa)</label>
                        <input
                            type="text"
                            value={form.icon ?? ''}
                            onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-transparent text-sm"
                            placeholder="np. 'Search', 'Rocket', itp."
                        />
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
                        Aktywna (widoczna na stronie)
                    </label>
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
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Lista usług</h2>

                {loading && items.length === 0 && (
                    <p className="text-sm text-gray-500">Ładowanie...</p>
                )}

                {items.length === 0 && !loading && (
                    <p className="text-sm text-gray-500">Brak usług. Dodaj pierwszą powyżej.</p>
                )}

                <ul className="space-y-3">
                    {items.map(item => (
                        <li
                            key={item.id}
                            className="flex items-center justify-between gap-4 px-3 py-2 rounded-md border border-gray-200 dark:border-neutral-800"
                        >
                            <div>
                                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold dark:text-neutral-50">
                    {item.title}
                  </span>
                                    {!item.is_active && (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200">
                      ukryta
                    </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-neutral-400 line-clamp-2">
                                    {item.description}
                                </p>
                                <p className="text-[11px] text-gray-400 mt-1">
                                    Kolejność: {item.order} {item.icon && `· Ikona: ${item.icon}`}
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

export default ServicesAdmin;
