const TMDB_API_KEY =
	process.env.TMDB_API_KEY ||
	process.env.NEXT_PUBLIC_TMDB_API_KEY ||
	'YOUR_TMDB_API_KEY';
const BASE_URL = 'https://api.themoviedb.org/3';
const GENRE_ANIMATION = 16;
const GENRE_DOCUMENTARY = 99;
const GENRE_REALITY = 10764;
const GENRE_TALK = 10767;

export type ContentType = 'movie' | 'tv';

export interface TMDBContent {
	id: number;
	title?: string;
	name?: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	vote_average: number;
	release_date?: string;
	first_air_date?: string;
	original_language?: string;
	genre_ids?: number[];
	genres?: { id: number; name: string }[];
	origin_country?: string[];
	status?: string;
	runtime?: number;
	episode_run_time?: number[];
	networks?: { id: number; name: string }[];
	production_companies?: { id: number; name: string }[];
	credits?: { cast: any[] };
	recommendations?: { results: TMDBContent[] };
}

function isEastAsianContent(item: TMDBContent) {
	const hasEastAsianCountry =
		item.origin_country?.includes('KR') || item.origin_country?.includes('CN');
	const hasEastAsianLanguage =
		item.original_language === 'ko' || item.original_language === 'zh';

	return hasEastAsianCountry || hasEastAsianLanguage;
}

function isExcludedGenre(item: TMDBContent, type: ContentType) {
	const genreIds = item.genre_ids || item.genres?.map((g) => g.id) || [];
	if (genreIds.includes(GENRE_ANIMATION)) {
		return true;
	}

	if (genreIds.includes(GENRE_DOCUMENTARY)) {
		return true;
	}

	if (type === 'tv' && genreIds.includes(GENRE_REALITY)) {
		return true;
	}

	if (type === 'tv' && genreIds.includes(GENRE_TALK)) {
		return true;
	}

	return false;
}

// Mock data for fallback
const MOCK_TRENDING: TMDBContent[] = [
	{
		id: 1,
		name: 'Crash Landing on You',
		overview:
			'A paragliding mishap drops a South Korean heiress in North Korea - and into the life of an army officer, who decides he will help her hide.',
		poster_path: null,
		backdrop_path: null,
		vote_average: 8.8,
		first_air_date: '2019-12-14',
		origin_country: ['KR'],
		genres: [
			{ id: 1, name: 'Romance' },
			{ id: 2, name: 'Drama' },
		],
	},
	{
		id: 2,
		name: 'The Untamed',
		overview:
			'Two talented cultivators from different sects become close friends and find themselves entangled in a conspiracy that spans years.',
		poster_path: null,
		backdrop_path: null,
		vote_average: 8.5,
		first_air_date: '2019-06-27',
		origin_country: ['CN'],
		genres: [
			{ id: 3, name: 'Fantasy' },
			{ id: 4, name: 'Wuxia' },
		],
	},
	{
		id: 3,
		name: 'Squid Game',
		overview:
			"Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
		poster_path: null,
		backdrop_path: null,
		vote_average: 7.8,
		first_air_date: '2021-09-17',
		origin_country: ['KR'],
		genres: [{ id: 5, name: 'Thriller' }],
	},
	{
		id: 4,
		name: 'Guardian',
		overview:
			'A mysterious case leads a detective to cross paths with a mysterious professor, uncovering a hidden world of supernatural beings.',
		poster_path: null,
		backdrop_path: null,
		vote_average: 8.2,
		first_air_date: '2018-06-13',
		origin_country: ['CN'],
		genres: [{ id: 3, name: 'Fantasy' }],
	},
];

export async function fetchTMDB(
	endpoint: string,
	params: Record<string, string> = {},
) {
	// If API key is still the placeholder, we don't even try to fetch to avoid console errors
	if (TMDB_API_KEY === 'YOUR_TMDB_API_KEY') {
		throw new Error('Unauthorized');
	}

	const url = new URL(`${BASE_URL}${endpoint}`);
	url.searchParams.append('api_key', TMDB_API_KEY);
	Object.entries(params).forEach(([key, value]) =>
		url.searchParams.append(key, value),
	);

	const response = await fetch(url.toString(), { next: { revalidate: 3600 } });
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(
			`TMDb API error: ${response.statusText} ${errorData.status_message || ''}`,
		);
	}
	return response.json();
}

export async function searchContent(
	query: string,
	type: ContentType = 'tv',
): Promise<TMDBContent[]> {
	try {
		const data = await fetchTMDB(`/search/${type}`, { query });
		return data.results.filter(
			(item: TMDBContent) =>
				isEastAsianContent(item) && !isExcludedGenre(item, type),
		);
	} catch (error) {
		console.warn('Using mock search results due to API error', error);
		return MOCK_TRENDING.filter(
			(item) =>
				item.name?.toLowerCase().includes(query.toLowerCase()) ||
				item.overview.toLowerCase().includes(query.toLowerCase()),
		).filter((item) => !isExcludedGenre(item, type));
	}
}

export async function getTrendingEastAsian(
	type: ContentType = 'tv',
): Promise<TMDBContent[]> {
	try {
		const withoutGenres =
			type === 'tv'
				? `${GENRE_ANIMATION},${GENRE_DOCUMENTARY},${GENRE_REALITY},${GENRE_TALK}`
				: `${GENRE_ANIMATION},${GENRE_DOCUMENTARY}`;

		const data = await fetchTMDB(`/discover/${type}`, {
			with_origin_country: 'KR|CN',
			with_original_language: 'ko|zh',
			sort_by: 'popularity.desc',
			include_adult: 'false',
			without_genres: withoutGenres,
		});
		return data.results.filter(
			(item: TMDBContent) => !isExcludedGenre(item, type),
		);
	} catch (error) {
		console.warn('Using mock trending data due to API error', error);
		return MOCK_TRENDING.filter((item) => !isExcludedGenre(item, type));
	}
}

export async function getContentDetails(
	type: ContentType,
	id: string,
): Promise<TMDBContent> {
	try {
		const content = await fetchTMDB(`/${type}/${id}`, {
			append_to_response: 'credits,recommendations',
		});

		if (content.recommendations?.results) {
			content.recommendations.results = content.recommendations.results.filter(
				(item: TMDBContent) => !isExcludedGenre(item, type),
			);
		}

		return content;
	} catch (error) {
		console.warn('Using mock detail data due to API error', error);
		const mock =
			MOCK_TRENDING.find((m) => m.id === parseInt(id)) || MOCK_TRENDING[0];
		return {
			...mock,
			status: 'Released',
			runtime: 60,
			genres: mock.genres || [],
			credits: { cast: [] },
			recommendations: {
				results: MOCK_TRENDING.filter(
					(m) => m.id !== parseInt(id) && !isExcludedGenre(m, type),
				),
			},
		};
	}
}

export function getImageUrl(
	path: string | null,
	size: 'w500' | 'original' = 'w500',
) {
	if (!path) return `https://picsum.photos/seed/${Math.random()}/500/750`;
	return `https://image.tmdb.org/t/p/${size}${path}`;
}
