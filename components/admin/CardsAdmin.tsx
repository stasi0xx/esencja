import React, { useEffect, useState, useRef } from 'react';
import type { CardItem } from '../../types';
import { cardsService } from '../../services/cardsService';

const emptyForm: Omit<CardItem, 'id' | 'created_at' | 'updated_at'> = {
    title: '',
    subtitle: '',
    description: '',
    icon: '',
    order: 0,
    is_active: true,
    highlight_start: null,
    highlight_end: null,

};

const CardsAdmin: React.FC = () => {
    const [items, setItems] = useState<CardItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<typeof emptyForm>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

    const handleSetHighlightFromSelection = () => {
        const el = descriptionRef.current;
        if (!el) return;

        const start = el.selectionStart;
        const end = el.selectionEnd;

        if (start === end) {
            alert('Zaznacz fragment tekstu w opisie, aby go wyróżnić.');
            return;
        }

        setForm((prev) => ({
            ...prev,
            highlight_start: start,
            highlight_end: end,
        }));
    };

    const load = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await cardsService.getAll({ includeInactive: true });
            setItems(data);
        } catch (e) {
            console.error(e);
            setError('Nie udało się pobrać listy kart.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void load();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            if (!form.title) {
                setError('Tytuł jest wymagany.');
                return;
            }

            if (editingId) {
                await cardsService.update(editingId, form);
            } else {
                await cardsService.create(form);
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

    const handleEdit = (item: CardItem) => {
        setEditingId(item.id);
        setForm({
            title: item.title,
            subtitle: item.subtitle ?? '',
            description: item.description ?? '',
            icon: item.icon ?? '',
            order: item.order,
            is_active: item.is_active,
            highlight_start: item.highlight_start ?? null,
            highlight_end: item.highlight_end ?? null,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };



    const handleDelete = async (id: string) => {
        if (!window.confirm('Na pewno usunąć tę kartę?')) return;
        try {
            setLoading(true);
            await cardsService.delete(id);
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
            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 space-y-4"
            >
                <h2 className="text-xl font-semibold mb-2 dark:text-white">
                    {editingId ? 'Edytuj kartę' : 'Dodaj nową kartę'}
                </h2>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-neutral-200">
                        Tytuł
                    </label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, title: e.target.value }))
                        }
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-transparent text-sm"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-neutral-200">
                        Podtytuł (opcjonalnie)
                    </label>
                    <input
                        type="text"
                        value={form.subtitle ?? ''}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, subtitle: e.target.value }))
                        }
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-transparent text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-neutral-200">
                        Opis (opcjonalnie)
                    </label>
                    <textarea
                        ref={descriptionRef}
                        value={form.description ?? ''}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, description: e.target.value }))
                        }
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-transparent text-sm min-h-[80px]"
                    />
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                        <button
                            type="button"
                            onClick={handleSetHighlightFromSelection}
                            className="px-2 py-1 rounded-md border border-gray-300 dark:border-neutral-700 text-[11px] font-semibold"
                        >
                            Ustaw zaznaczenie jako highlight
                        </button>
                        {form.highlight_start != null && form.highlight_end != null && (
                            <span className="text-gray-500 dark:text-neutral-400">
        Highlight: znaki {form.highlight_start}–{form.highlight_end}
      </span>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-neutral-200">
                        Ikona (np. nazwa z lucide-react)
                    </label>
                    <input
                        type="text"
                        value={form.icon ?? ''}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, icon: e.target.value }))
                        }
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-transparent text-sm"
                        placeholder="np. 'Search', 'Rocket', 'Sparkles'"
                    />
                    <p className="mt-1 text-[11px] text-gray-500 dark:text-neutral-400">
                        Tutaj możesz wpisać nazwę ikony, której użyjesz potem w komponencie
                        frontowym (np. mapowanie nazwy na komponent z lucide-react).
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-neutral-200">
                            Kolejność
                        </label>
                        <input
                            type="number"
                            value={form.order}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    order: Number(e.target.value) || 0,
                                }))
                            }
                            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-transparent text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                        <input
                            id="card_is_active"
                            type="checkbox"
                            checked={form.is_active}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, is_active: e.target.checked }))
                            }
                            className="w-4 h-4"
                        />
                        <label
                            htmlFor="card_is_active"
                            className="text-sm dark:text-neutral-200"
                        >
                            Aktywna (widoczna na stronie)
                        </label>
                    </div>
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
                <h2 className="text-xl font-semibold mb-4 dark:text-white">
                    Lista kart
                </h2>

                {loading && items.length === 0 && (
                    <p className="text-sm text-gray-500">Ładowanie...</p>
                )}

                {items.length === 0 && !loading && (
                    <p className="text-sm text-gray-500">
                        Brak kart. Dodaj pierwszą powyżej.
                    </p>
                )}

                <ul className="space-y-3">
                    {items.map((item) => (
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
                                {item.subtitle && (
                                    <p className="text-xs text-gray-600 dark:text-neutral-300">
                                        {item.subtitle}
                                    </p>
                                )}
                                {item.description && (
                                    <p className="text-[11px] text-gray-500 dark:text-neutral-400 line-clamp-2 mt-1">
                                        {(() => {
                                            const desc = item.description ?? '';
                                            const s = item.highlight_start ?? null;
                                            const e = item.highlight_end ?? null;

                                            if (
                                                s === null ||
                                                e === null ||
                                                s < 0 ||
                                                e <= s ||
                                                e > desc.length
                                            ) {
                                                return desc;
                                            }

                                            const before = desc.slice(0, s);
                                            const highlighted = desc.slice(s, e);
                                            const after = desc.slice(e);

                                            return (
                                                <>
                                                    {before}
                                                    <span className="font-semibold underline">
            {highlighted}
          </span>
                                                    {after}
                                                </>
                                            );
                                        })()}
                                    </p>
                                )}
                                <p className="text-[11px] text-gray-400 mt-1">
                                    Kolejność: {item.order}{' '}
                                    {item.icon && `· Ikona: ${item.icon}`}
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

export default CardsAdmin;