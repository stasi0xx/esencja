// TypeScript TSX
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

type AuthContextType = {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error?: string }>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        (async () => {
            const { data, error } = await supabase.auth.getSession();
            if (mounted) {
                if (error) console.error('getSession error', error);
                setSession(data.session ?? null);
                setLoading(false);
            }
        })();

        const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession);
        });

        return () => {
            mounted = false;
            sub.subscription.unsubscribe();
        };
    }, []);

    const value = useMemo<AuthContextType>(() => ({
        session,
        user: session?.user ?? null,
        loading,
        async signIn(email: string, password: string) {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            return { error: error?.message };
        },
        async signOut() {
            await supabase.auth.signOut();
        },
    }), [session, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}