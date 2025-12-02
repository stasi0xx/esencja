import React, { FormEvent, useEffect, useState } from 'react';
import { blogService } from '../../services/blogService';
import type {BlogCategory, BlogPost} from '../../types';
import { RichTextEditor } from '../RichTextEditor';
import { sanitizeHtml } from '../../utils/sanitizeHtml';
import { ImageUploadInput } from '../imageUploadInput';
import { useBlogCategories } from '../../hooks/useBlogCategories';

const BlogAdmin: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [currentPost, setCurrentPost] = useState<
        Partial<BlogPost> & { originalSlug?: string }
    >({});
    const [isEditing, setIsEditing] = useState(false);
    const [img_url, setImageUrl] = useState<string>('');
    const { categories, loading: categoriesLoading } = useBlogCategories();

    useEffect(() => {
        void loadPosts();
    }, []);

    const loadPosts = async () => {
        const allPosts = await blogService.getPosts();
        setPosts(allPosts);
    };

    const handleEdit = (post: BlogPost) => {
        setCurrentPost({ ...post, originalSlug: post.slug });
        setIsEditing(true);
        setImageUrl(post.img_url ?? '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (slug: string) => {
        if (
            !window.confirm(
                'Czy na pewno chcesz usunąć ten post? Tej operacji nie można cofnąć.'
            )
        ) {
            return;
        }
        await blogService.deletePost(slug);
        await loadPosts();
    };

    const handleFormChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setCurrentPost((prev) => ({ ...prev, [name]: value }));
    };


    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const postData = {
            title: currentPost.title || '',
            summary: currentPost.summary || '',
            slug: currentPost.slug || '',
            category: currentPost.category || 'SEO',
            img_url:
                img_url ||
                currentPost.img_url ||
                `https://picsum.photos/seed/${Math.random()}/800/600`,
            content: currentPost.content || '',
        };

        if (!postData.title || !postData.summary || !postData.category || !postData.slug) {
            alert('Proszę wypełnić wszystkie pola: Tytuł, Podsumowanie, Kategoria, Slug.');
            return;
        }

        if (isEditing && currentPost.originalSlug) {
            const updatedPost: Partial<BlogPost> = {
                ...postData,
            };
            await blogService.updatePost(currentPost.originalSlug, updatedPost);
        } else {
            await blogService.addPost(postData);
        }

        resetForm();
        await loadPosts();
    };

    const resetForm = () => {
        setCurrentPost({});
        setIsEditing(false);
        setImageUrl('');
    };

    const handleAddTestPost = () => {
        const timestamp = new Date().toLocaleTimeString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        const testPost: Partial<BlogPost> = {
            title: `Testowy Post ${timestamp}`,
            summary:
                'To jest krótkie podsumowanie testowego posta dodanego w celach demonstracyjnych.',
            category: 'SEO',
            img_url: `https://picsum.photos/seed/${Math.random()}/800/600`,
            content:
                '## To jest post testowy\n\nWygenerowany automatycznie, aby ułatwić testowanie funkcjonalności dodawania nowych wpisów.\n\n*   Punkt pierwszy\n*   Punkt drugi\n*   Punkt trzeci',
        };

        setCurrentPost(testPost);
        setImageUrl(testPost.img_url ?? '');
        setIsEditing(false);
    };

    return (
        <div className="space-y-12">
            {/* Formularz dodawania / edycji */}
            <div className="max-w-2xl mx-auto bg-white dark:bg-neutral-900 p-8 rounded-lg shadow-md border border-gray-200 dark:border-neutral-800">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isEditing ? 'Edytuj Post' : 'Dodaj Nowy Post'}
                    </h2>
                    {!isEditing && (
                        <button
                            type="button"
                            onClick={handleAddTestPost}
                            className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-200 rounded-md hover:bg-green-200 dark:hover:bg-green-800"
                        >
                            Dodaj Post Testowy
                        </button>
                    )}
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Tytuł
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={currentPost.title || ''}
                            onChange={handleFormChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white p-2"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="summary"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Podsumowanie
                        </label>
                        <textarea
                            name="summary"
                            id="summary"
                            value={currentPost.summary || ''}
                            onChange={handleFormChange}
                            required
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white p-2"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="category"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Kategoria
                        </label>
                        <select
                            name="category"
                            id="category"
                            value={currentPost.category || (categories[0]?.id || '')}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white p-2"
                            disabled={categoriesLoading}
                        >
                            <option value="">-- Wybierz kategorię --</option>
                            {categories.map((cat: BlogCategory) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div>
                        <label
                            htmlFor="slug"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Slug (URL-friendly nazwa)
                        </label>
                        <input
                            type="text"
                            name="slug"
                            id="slug"
                            value={currentPost.slug || ''}
                            onChange={handleFormChange}
                            placeholder="np. moj-artykul-seo"
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white p-2"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                            {isEditing ? 'Zmiana slug-a zmieni URL artykułu' : 'Wygenerowany automatycznie, jeśli pominięty'}
                        </p>
                    </div>


                    <div>
                        <ImageUploadInput
                            value={img_url}
                            onChange={(url) => {
                                setImageUrl(url);
                                setCurrentPost((prev) => ({ ...prev, img_url: url }));
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Treść (HTML przez Jodit)
                        </label>
                        <div className="mt-2 border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-neutral-800">
                            <RichTextEditor
                                value={currentPost.content || ''}
                                onChange={(val) =>
                                    setCurrentPost((prev) => ({ ...prev, content: val }))
                                }
                                onBlurChange={(val) =>
                                    setCurrentPost((prev) => ({ ...prev, content: val }))
                                }
                                height={360}
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Podgląd (sanityzowany HTML)
                            </label>
                            <div
                                className="rounded-md border border-gray-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900 prose dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: sanitizeHtml(currentPost.content || ''),
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                        {isEditing && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-neutral-200 bg-gray-100 dark:bg-gray-600 border border-transparent rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
                            >
                                Anuluj Edycję
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 dark:bg-gray-200 dark:text-gray-900 border border-transparent rounded-md shadow-sm hover:bg-gray-900 dark:hover:bg-white"
                        >
                            {isEditing ? 'Zapisz Zmiany' : 'Dodaj Post'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Lista postów */}
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-lg shadow-md border border-gray-200 dark:border-neutral-800">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Istniejące Posty ({posts.length})
                </h2>
                <div className="space-y-4">
                    {posts.map((post) => (
                        <div
                            key={post.slug}
                            className="p-4 border dark:border-gray-600 rounded-md flex justify-between items-center bg-gray-50 dark:bg-neutral-800/50"
                        >
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-neutral-400">
                                    /{post.slug}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(post)}
                                    className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800"
                                >
                                    Edytuj
                                </button>
                                <button
                                    onClick={() => handleDelete(post.slug)}
                                    className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-800"
                                >
                                    Usuń
                                </button>
                            </div>
                        </div>
                    ))}
                    {posts.length === 0 && (
                        <p className="text-sm text-gray-500 dark:text-neutral-400">
                            Brak postów. Dodaj pierwszy za pomocą formularza powyżej.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogAdmin;