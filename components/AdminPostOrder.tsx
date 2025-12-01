
import { useState, useEffect } from 'react';
import { blogService } from '../services/blogService';
import type { BlogPost } from '../types';

const AdminPostOrder = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await blogService.getPosts();
            // Sortuj po polu order
            const sorted = data.sort((a, b) => {
                const orderA = a.order ?? Number.MAX_VALUE;
                const orderB = b.order ?? Number.MAX_VALUE;
                return orderA - orderB;
            });
            setPosts(sorted);
        } catch (err) {
            setError('Błąd przy pobieraniu postów');
            console.error('Błąd przy pobieraniu postów:', err);
        } finally {
            setLoading(false);
        }
    };

    const movePost = async (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === posts.length - 1)
        ) {
            return;
        }

        const newPosts = [...posts];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        // Zamień całe obiekty
        [newPosts[index], newPosts[swapIndex]] = [newPosts[swapIndex], newPosts[index]];

        // Aktualizuj wartości order
        newPosts.forEach((post, idx) => {
            post.order = idx;
        });

        setPosts(newPosts);

        // Zapisz zmiany w bazie
        try {
            await Promise.all(
                newPosts.map(post => {
                    if (!post.id) {
                        console.warn('Post bez ID:', post);
                        return Promise.resolve();
                    }
                    return blogService.updatePostOrder(post.id, post.order ?? 0);
                })
            );
        } catch (err) {
            setError('Błąd przy aktualizacji kolejności');
            console.error('Błąd przy aktualizacji kolejności:', err);
            // Przywróć poprzednią kolejność
            fetchPosts();
        }
    };

    if (loading) return <div className="p-4 text-center">Ładowanie...</div>;

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 border border-gray-200 dark:border-neutral-800">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Zarządzanie kolejnością postów</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded">
                    {error}
                </div>
            )}

            {posts.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Brak postów do wyświetlenia</p>
            ) : (
                <div className="space-y-2">
                    {posts.map((post, index) => (
                        <div
                            key={`${post.slug}-${index}`}
                            className="flex items-center justify-between p-3 bg-gray-100 dark:bg-neutral-800 rounded hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                        >
                            <span className="font-medium dark:text-gray-200">
                                {(post.order ?? index) + 1}. {post.title}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => movePost(index, 'up')}
                                    disabled={index === 0}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Przenieś w górę"
                                >
                                    ↑
                                </button>
                                <button
                                    onClick={() => movePost(index, 'down')}
                                    disabled={index === posts.length - 1}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Przenieś w dół"
                                >
                                    ↓
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPostOrder;