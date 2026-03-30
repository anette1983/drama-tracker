const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, {
		credentials: 'include',
		headers: { 'Content-Type': 'application/json', ...options?.headers },
		...options,
	});

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
		googleUrl: `${API_BASE}/auth/google`,
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
