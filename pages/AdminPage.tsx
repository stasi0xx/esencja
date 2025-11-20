import React, { useState, useEffect, FormEvent } from 'react';
import { blogService } from '../services/blogService';
import type { BlogPost } from '../types';
import { Lock } from 'lucide-react';
import { RichTextEditor } from "../components/RichTextEditor";
import { sanitizeHtml } from "../utils/sanitizeHtml";
import {ImageUploadInput} from "../components/imageUploadInput.tsx";


const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [currentPost, setCurrentPost] = useState<Partial<BlogPost> & { originalSlug?: string }>({});
    const [isEditing, setIsEditing] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>('');



    useEffect(() => {
        // Load posts only if authenticated
        if (isAuthenticated) {
            loadPosts();
        }
    }, [isAuthenticated]);

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') {
            setIsAuthenticated(true);
            setLoginError('');
        } else {
            setLoginError('Nieprawidłowe hasło. Spróbuj ponownie.');
            setPassword('');
        }
    };

    const loadPosts = async () => {
        const allPosts = await blogService.getPosts();
        setPosts(allPosts);
    };

    const handleEdit = (post: BlogPost) => {
        setCurrentPost({ ...post, originalSlug: post.slug });
        setIsEditing(true);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (slug: string) => {
        if (confirm("Czy na pewno chcesz usunąć ten post? Tej operacji nie można cofnąć.")) {
            await blogService.deletePost(slug);
            await loadPosts();
        }
    };
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentPost(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const postData = {
            title: currentPost.title || '',
            summary: currentPost.summary || '',
            category: currentPost.category || 'SEO',
            imageUrl: currentPost.imageUrl || `https://picsum.photos/seed/${Math.random()}/800/600`,
            content: currentPost.content || '',
        };
        
        if (!postData.title || !postData.summary || !postData.category) {
            alert('Proszę wypełnić wszystkie pola: Tytuł, Podsumowanie, Kategoria.');
            return;
        }

        if (isEditing && currentPost.originalSlug) {
            const updatedPost: BlogPost = {
                ...postData,
                slug: currentPost.slug || currentPost.originalSlug,
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
    };
    
    const handleAddTestPost = () => {
        const timestamp = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setCurrentPost({
            title: `Testowy Post ${timestamp}`,
            summary: 'To jest krótkie podsumowanie testowego posta dodanego w celach demonstracyjnych.',
            category: 'SEO',
            imageUrl: `https://picsum.photos/seed/${Math.random()}/800/600`,
            content: `## To jest post testowy\n\nWygenerowany automatycznie, aby ułatwić testowanie funkcjonalności dodawania nowych wpisów.\n\n*   Punkt pierwszy\n*   Punkt drugi\n*   Punkt trzeci`,
        });
        setIsEditing(false); // Upewnij się, że jesteśmy w trybie dodawania
    };

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto px-6 py-16 flex items-center justify-center min-h-[calc(100vh-10rem)]">
                <div className="w-full max-w-md">
                    <form onSubmit={handleLogin} className="bg-white dark:bg-neutral-900 p-8 rounded-lg shadow-md border border-gray-200 dark:border-neutral-800">
                        <div className="text-center mb-6">
                           <Lock className="mx-auto h-12 w-12 text-gray-400" />
                           <h1 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">Panel Administratora</h1>
                           <p className="text-gray-600 dark:text-neutral-400 text-sm mt-1">Wymagane uwierzytelnienie</p>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hasło</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white p-2" 
                            />
                        </div>
                        {loginError && <p className="text-red-500 text-sm mt-2 text-center">{loginError}</p>}
                        <div className="mt-6">
                            <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-800 dark:bg-gray-200 dark:text-gray-900 border border-transparent rounded-md shadow-sm hover:bg-gray-900 dark:hover:bg-white">
                                Zaloguj się
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-16">
            <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200 p-4 rounded-md mb-8" role="alert">
                <p className="font-bold">Tryb demonstracyjny</p>
                <p>Zmiany w tym panelu są tylko tymczasowe i zostaną utracone po odświeżeniu strony. Ta wersja demonstracyjna nie posiada trwałej bazy danych.</p>
            </div>

            <h1 className="text-4xl font-bold mb-8 text-center dark:text-white">Panel Administratora</h1>
            
            <div className="max-w-2xl mx-auto bg-white dark:bg-neutral-900 p-8 rounded-lg shadow-md border border-gray-200 dark:border-neutral-800 mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{isEditing ? 'Edytuj Post' : 'Dodaj Nowy Post'}</h2>
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
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tytuł</label>
                        <input type="text" name="title" id="title" value={currentPost.title || ''} onChange={handleFormChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white p-2" />
                    </div>
                     <div>
                        <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Podsumowanie</label>
                        <textarea name="summary" id="summary" value={currentPost.summary || ''} onChange={handleFormChange} required rows={3} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white p-2"></textarea>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kategoria</label>
                        <select name="category" id="category" value={currentPost.category || 'SEO'} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white p-2">
                            <option>SEO</option>
                            <option>Content Strategy</option>
                            <option>Social Media</option>
                        </select>
                    </div>
                     <div>
                         <ImageUploadInput
                             value={imageUrl}
                             onChange={(url) => setImageUrl(url)}
                             // bucket="blog-images" // opcjonalnie zmień nazwę, jeśli używasz innej
                         />

                     </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Treść (HTML przez Jodit)
                        </label>
                        <div className="mt-2 border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-neutral-800">
                            <RichTextEditor
                                value={currentPost.content || ""}
                                onChange={(val) =>
                                    setCurrentPost((prev) => ({ ...prev, content: val }))
                                }
                                // opcjonalnie: zapisy na blur, jeśli wolisz rzadziej aktualizować state
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
                                    __html: sanitizeHtml(currentPost.content || ""),
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                        {isEditing && <button type="button" onClick={resetForm} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-neutral-200 bg-gray-100 dark:bg-gray-600 border border-transparent rounded-md hover:bg-gray-200 dark:hover:bg-gray-500">Anuluj Edycję</button>}
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-gray-800 dark:bg-gray-200 dark:text-gray-900 border border-transparent rounded-md shadow-sm hover:bg-gray-900 dark:hover:bg-white">{isEditing ? 'Zapisz Zmiany' : 'Dodaj Post'}</button>
                    </div>
                </form>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-8 rounded-lg shadow-md border border-gray-200 dark:border-neutral-800">
                 <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Istniejące Posty ({posts.length})</h2>
                 <div className="space-y-4">
                    {posts.map(post => (
                        <div key={post.slug} className="p-4 border dark:border-gray-600 rounded-md flex justify-between items-center bg-gray-50 dark:bg-neutral-800/50">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{post.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-neutral-400">/{post.slug}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => handleEdit(post)} className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800">Edytuj</button>
                                <button onClick={() => handleDelete(post.slug)} className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-800">Usuń</button>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default AdminPage;