const API_BASE =
	typeof window !== 'undefined'
		? '/api' // Browser: use Next.js proxy (same-origin, no CORS/cookie issues)
		: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'; // SSR: direct

let csrfToken: string | null = null;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...((options?.headers as Record<string, string>) ?? {}),
	};

	if (csrfToken) {
		headers['X-CSRF-Token'] = csrfToken;
	}

	const res = await fetch(`${API_BASE}${path}`, {
		credentials: 'include',
		...options,
		headers,
	});

	const newToken = res.headers.get('X-CSRF-Token');
	if (newToken) {
		csrfToken = newToken;
	}

	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body.message || `API error: ${res.status}`);
	}

	if (res.status === 204) return undefined as T;
	return res.json();
}

// Auth
export const api = {
	auth: {
		me: () => request<any>('/auth/me'),
		register: (email: string, password: string, displayName?: string) =>
			request<any>('/auth/register', {
				method: 'POST',
				body: JSON.stringify({ email, password, displayName }),
			}),
		login: (email: string, password: string) =>
			request<any>('/auth/login', {
				method: 'POST',
				body: JSON.stringify({ email, password }),
			}),
		logout: () => request<void>('/auth/logout', { method: 'POST' }),
		googleUrl:
			typeof window !== 'undefined'
				? '/api/auth/google'
				: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/google`,
	},

	// Favorites
	favorites: {
		list: (page = 1, limit = 20) =>
			request<{ items: any[]; total: number }>(
				`/favorites?page=${page}&limit=${limit}`,
			),
		add: (data: {
			contentId: string;
			contentType: string;
			title: string;
			posterPath?: string;
		}) =>
			request<any>('/favorites', {
				method: 'POST',
				body: JSON.stringify(data),
			}),
		remove: (id: string) =>
			request<void>(`/favorites/${id}`, { method: 'DELETE' }),
		check: (contentType: string, contentId: string) =>
			request<{ favorited: boolean; id?: string }>(
				`/favorites/check/${contentType}/${contentId}`,
			),
	},

	// Watched
	watched: {
		list: (page = 1, limit = 20, status?: string) =>
			request<{ items: any[]; total: number }>(
				`/watched?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`,
			),
		add: (data: {
			contentId: string;
			contentType: string;
			title: string;
			posterPath?: string;
			progress?: number;
			rating?: number;
		}) =>
			request<any>('/watched', { method: 'POST', body: JSON.stringify(data) }),
		update: (
			id: string,
			data: { progress?: number; rating?: number; review?: string },
		) =>
			request<any>(`/watched/${id}`, {
				method: 'PATCH',
				body: JSON.stringify(data),
			}),
		remove: (id: string) =>
			request<void>(`/watched/${id}`, { method: 'DELETE' }),
		check: (contentType: string, contentId: string) =>
			request<{ watched: boolean; id?: string; progress?: number }>(
				`/watched/check/${contentType}/${contentId}`,
			),
	},

	// Recommendations
	recommendations: {
		get: () => request<{ recommendations: any[] }>('/recommendations'),
	},
};
