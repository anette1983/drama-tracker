'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
	type ReactNode,
} from 'react';
import { api } from '@/lib/api';

interface User {
	id: string;
	email: string;
	displayName?: string;
	photoURL?: string;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (
		email: string,
		password: string,
		displayName?: string,
	) => Promise<void>;
	logout: () => Promise<void>;
	refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const refresh = useCallback(async () => {
		try {
			const me = await api.auth.me();
			setUser(me);
		} catch {
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		refresh();
	}, [refresh]);

	const login = async (email: string, password: string) => {
		const me = await api.auth.login(email, password);
		setUser(me);
	};

	const register = async (
		email: string,
		password: string,
		displayName?: string,
	) => {
		const me = await api.auth.register(email, password, displayName);
		setUser(me);
	};

	const logout = async () => {
		await api.auth.logout();
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{ user, loading, login, register, logout, refresh }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}
