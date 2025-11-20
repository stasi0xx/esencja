// TypeScript TSX
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export default function LoginPage() {
    const [email, setEmail] = useState('<ADMIN_EMAIL>');
    const [password, setPassword] = useState('<ADMIN_PASSWORD>');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation() as any;
    const from = location.state?.from?.pathname || '/admin';

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const { error } = await signIn(email, password);
        setLoading(false);
        if (error) {
            setError(error);
        } else {
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-16">
            <h1 className="text-xl font-semibold mb-4">Logowanie</h1>
            <form onSubmit={onSubmit} className="space-y-3">
                <input
                    type="email"
                    className="w-full rounded border p-2"
                    placeholder="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                />
                <input
                    type="password"
                    className="w-full rounded border p-2"
                    placeholder="hasło"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                />
                {error && <div className="text-sm text-red-600">{error}</div>}
                <button
                    type="submit"
                    className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? 'Logowanie…' : 'Zaloguj'}
                </button>
            </form>
        </div>
    );
}