import { Navbar } from '@/components/navbar';
import {
	getTrendingByLanguage,
	getTrendingEastAsian,
	searchContent,
	type TMDBContent,
} from '@/lib/tmdb';
import { ContentCard } from '@/components/content-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function mergeUniqueById(primary: TMDBContent[], secondary: TMDBContent[]) {
	const seen = new Set<number>();
	const merged: TMDBContent[] = [];

	for (const item of [...primary, ...secondary]) {
		if (seen.has(item.id)) {
			continue;
		}
		seen.add(item.id);
		merged.push(item);
	}

	return merged;
}

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; mode?: string }>;
}) {
	const params = await searchParams;
	const query = params.q || '';
	const isPopularMode = params.mode === 'popular';

	const [movieResults, tvResults, koreanDramas, chineseDramas] = isPopularMode
		? await Promise.all([
				getTrendingEastAsian('movie'),
				getTrendingEastAsian('tv'),
				getTrendingByLanguage('tv', 'ko'),
				getTrendingByLanguage('tv', 'zh'),
			])
		: await Promise.all([
				searchContent(query, 'movie'),
				searchContent(query, 'tv'),
				Promise.resolve([] as TMDBContent[]),
				Promise.resolve([] as TMDBContent[]),
			]);

	const displayedTvResults = isPopularMode
		? mergeUniqueById(koreanDramas, chineseDramas)
		: tvResults;

	return (
		<div className='min-h-screen flex flex-col bg-background'>
			<Navbar />
			<main className='flex-1 container mx-auto px-4 py-8'>
				<header className='mb-10'>
					<h1 className='text-3xl font-headline font-bold mb-2'>
						{isPopularMode
							? 'Popular in Korean and Chinese Cinema'
							: `Search Results for "${query}"`}
					</h1>
					<p className='text-muted-foreground'>
						{isPopularMode
							? `Showing ${movieResults.length + displayedTvResults.length} popular titles across dramas and movies.`
							: `Found ${movieResults.length + displayedTvResults.length} matches in Korean and Chinese cinema.`}
					</p>
				</header>

				<Tabs defaultValue='all' className='w-full'>
					<TabsList className='bg-primary/10 mb-8'>
						<TabsTrigger value='all'>All Results</TabsTrigger>
						<TabsTrigger value='tv'>
							Dramas ({displayedTvResults.length})
						</TabsTrigger>
						<TabsTrigger value='movie'>
							Movies ({movieResults.length})
						</TabsTrigger>
					</TabsList>

					<TabsContent value='all' className='space-y-12'>
						{isPopularMode ? (
							<>
								{koreanDramas.length > 0 && (
									<section>
										<h2 className='text-xl font-bold mb-6 flex items-center gap-2'>
											Korean Dramas
											<span className='h-px flex-1 bg-border ml-4' />
										</h2>
										<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
											{koreanDramas.map((item) => (
												<ContentCard key={item.id} content={item} type='tv' />
											))}
										</div>
									</section>
								)}

								{chineseDramas.length > 0 && (
									<section>
										<h2 className='text-xl font-bold mb-6 flex items-center gap-2'>
											Chinese Dramas
											<span className='h-px flex-1 bg-border ml-4' />
										</h2>
										<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
											{chineseDramas.map((item) => (
												<ContentCard key={item.id} content={item} type='tv' />
											))}
										</div>
									</section>
								)}
							</>
						) : (
							<section>
								<h2 className='text-xl font-bold mb-6 flex items-center gap-2'>
									Dramas
									<span className='h-px flex-1 bg-border ml-4' />
								</h2>
								<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
									{displayedTvResults.map((item) => (
										<ContentCard key={item.id} content={item} type='tv' />
									))}
								</div>
							</section>
						)}

						{movieResults.length > 0 && (
							<section>
								<h2 className='text-xl font-bold mb-6 flex items-center gap-2'>
									Movies
									<span className='h-px flex-1 bg-border ml-4' />
								</h2>
								<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
									{movieResults.map((item) => (
										<ContentCard key={item.id} content={item} type='movie' />
									))}
								</div>
							</section>
						)}

						{displayedTvResults.length === 0 && movieResults.length === 0 && (
							<div className='text-center py-20 bg-white/50 rounded-2xl border border-dashed border-primary/40'>
								<p className='text-xl text-muted-foreground mb-4'>
									{isPopularMode
										? 'No popular titles found right now'
										: `No results found for "${query}"`}
								</p>
								<p className='text-sm'>
									{isPopularMode
										? 'Please try again in a moment.'
										: 'Try searching for broader terms or check the spelling.'}
								</p>
							</div>
						)}
					</TabsContent>

					<TabsContent value='tv'>
						{isPopularMode ? (
							<div className='space-y-12'>
								<section>
									<h2 className='text-xl font-bold mb-6 flex items-center gap-2'>
										Korean Dramas
										<span className='h-px flex-1 bg-border ml-4' />
									</h2>
									<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
										{koreanDramas.map((item) => (
											<ContentCard key={item.id} content={item} type='tv' />
										))}
									</div>
								</section>

								<section>
									<h2 className='text-xl font-bold mb-6 flex items-center gap-2'>
										Chinese Dramas
										<span className='h-px flex-1 bg-border ml-4' />
									</h2>
									<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
										{chineseDramas.map((item) => (
											<ContentCard key={item.id} content={item} type='tv' />
										))}
									</div>
								</section>
							</div>
						) : (
							<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
								{displayedTvResults.map((item) => (
									<ContentCard key={item.id} content={item} type='tv' />
								))}
							</div>
						)}
					</TabsContent>

					<TabsContent value='movie'>
						<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
							{movieResults.map((item) => (
								<ContentCard key={item.id} content={item} type='movie' />
							))}
						</div>
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
}
