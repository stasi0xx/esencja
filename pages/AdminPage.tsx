
import React, { FormEvent, useState } from 'react';
import { Lock } from 'lucide-react';
import BlogAdmin from '../components/admin/BlogAdmin';
import AdminPostOrder from '../components/AdminPostOrder';
import ServicesAdmin from "../components/admin/ServicesAdmin.tsx";
import CardsAdmin from "../components/admin/CardsAdmin.tsx";
import TestimonialsAdmin from "../components/admin/TestimonialsAdmin.tsx";

type AdminTab = 'blog' | 'blog-order' | 'services' | 'cards' | 'testimonials';

const AdminPage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [activeTab, setActiveTab] = useState<AdminTab>('blog');

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

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto px-6 py-16 flex items-center justify-center min-h-[calc(100vh-10rem)]">
                <div className="w-full max-w-md">
                    <form
                        onSubmit={handleLogin}
                        className="bg-white dark:bg-neutral-900 p-8 rounded-lg shadow-md border border-gray-200 dark:border-neutral-800"
                    >
                        <div className="text-center mb-6">
                            <Lock className="mx-auto h-12 w-12 text-gray-400" />
                            <h1 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">
                                Panel Administratora
                            </h1>
                            <p className="text-gray-600 dark:text-neutral-400 text-sm mt-1">
                                Wymagane uwierzytelnienie
                            </p>
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Hasło
                            </label>
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
                        {loginError && (
                            <p className="text-red-500 text-sm mt-2 text-center">
                                {loginError}
                            </p>
                        )}
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-800 dark:bg-gray-200 dark:text-gray-900 border border-transparent rounded-md shadow-sm hover:bg-gray-900 dark:hover:bg-white"
                            >
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
            <div
                className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200 p-4 rounded-md mb-8"
                role="alert"
            >
                <p className="font-bold">Tryb demonstracyjny</p>
                <p>
                    Zmiany w tym panelu są tylko tymczasowe i zostaną utracone po
                    odświeżeniu strony. Ta wersja demonstracyjna nie posiada trwałej bazy
                    danych.
                </p>
            </div>

            <h1 className="text-4xl font-bold mb-6 text-center dark:text-white">
                Panel Administratora
            </h1>

            {/* Zakładki */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
                {(
                    [
                        { id: 'blog', label: 'Blog' },
                        { id: 'blog-order', label: 'Kolejność postów' },
                        { id: 'services', label: 'Usługi' },
                        { id: 'cards', label: 'Karty' },
                        { id: 'testimonials', label: 'Referencje' },
                    ] as const
                ).map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                            activeTab === tab.id
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                                : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-800'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Zawartość zakładek */}
            {activeTab === 'blog' && <BlogAdmin />}

            {activeTab === 'blog-order' && <AdminPostOrder />}

            {activeTab === 'services' && <ServicesAdmin />}

            {activeTab === 'cards' && <CardsAdmin />}

            {activeTab === 'testimonials' && <TestimonialsAdmin />}
        </div>
    );
};

export default AdminPage;