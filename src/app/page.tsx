import { Navbar } from '@/components/navbar';
import { getTrendingByLanguage, getTrendingEastAsian } from '@/lib/tmdb';
import { ContentCard } from '@/components/content-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Sparkles, Film, Tv, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default async function Home() {
	const [koreanDramas, chineseDramas, koreanMovies, chineseMovies] =
		await Promise.all([
			getTrendingByLanguage('tv', 'ko', {
				sortBy: 'vote_average.desc',
				minVotes: 150,
			}),
			getTrendingByLanguage('tv', 'zh', {
				sortBy: 'vote_average.desc',
				minVotes: 150,
			}),
			getTrendingByLanguage('movie', 'ko', {
				sortBy: 'vote_average.desc',
				minVotes: 150,
			}),
			getTrendingByLanguage('movie', 'zh', {
				sortBy: 'vote_average.desc',
				minVotes: 150,
			}),
		]);
	const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-drama');

	return (
		<div className='min-h-screen flex flex-col'>
			<Navbar />

			<main className='flex-1'>
				{/* Hero Section */}
				<section className='relative h-[500px] flex items-center justify-center overflow-hidden'>
					<div className='absolute inset-0 z-0'>
						{heroImage && (
							<Image
								src={heroImage.imageUrl}
								alt='Hero'
								fill
								className='object-cover brightness-75'
								priority
								data-ai-hint={heroImage.imageHint}
							/>
						)}
						<div className='absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background' />
					</div>

					<div className='relative z-10 container mx-auto px-4 text-center'>
						<h1 className='font-headline text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg'>
							EastAsian Serenity Tracker
						</h1>
						<p className='text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md'>
							Discover, track, and share your favorite Korean and Chinese dramas
							and movies in a peaceful digital space.
						</p>
						<div className='flex flex-wrap justify-center gap-4'>
							<Link href='/dashboard'>
								<Button
									size='lg'
									className='bg-accent hover:bg-accent/90 text-white gap-2 h-12 px-8 rounded-full shadow-lg'
								>
									<Sparkles className='w-5 h-5' />
									Get Started
								</Button>
							</Link>
							<Link href='/search?mode=popular'>
								<Button
									size='lg'
									variant='outline'
									className='bg-white/20 backdrop-blur-md text-white border-white/40 hover:bg-white/30 h-12 px-8 rounded-full'
								>
									Browse Popular
								</Button>
							</Link>
						</div>
					</div>
				</section>

				{/* Trending Dramas */}
				<section className='py-16 bg-background'>
					<div className='container mx-auto px-4'>
						<div className='flex items-center justify-between mb-8'>
							<div className='flex items-center gap-3'>
								<div className='p-2 rounded-lg bg-primary/20 text-accent'>
									<Tv className='w-6 h-6' />
								</div>
								<h2 className='text-2xl font-headline font-bold'>
									Trending Dramas
								</h2>
							</div>
							<Button
								variant='ghost'
								className='text-accent hover:text-accent/80 font-medium'
							>
								View All
							</Button>
						</div>

						<Tabs defaultValue='korean' className='w-full'>
							<TabsList className='bg-primary/10 mb-8'>
								<TabsTrigger value='korean'>Korean</TabsTrigger>
								<TabsTrigger value='chinese'>Chinese</TabsTrigger>
							</TabsList>

							<TabsContent value='korean'>
								<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
									{koreanDramas.slice(0, 12).map((item) => (
										<ContentCard key={item.id} content={item} type='tv' />
									))}
								</div>
							</TabsContent>

							<TabsContent value='chinese'>
								<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
									{chineseDramas.slice(0, 12).map((item) => (
										<ContentCard key={item.id} content={item} type='tv' />
									))}
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</section>

				{/* Features Info */}
				<section className='py-20 serenity-gradient'>
					<div className='container mx-auto px-4'>
						<div className='grid md:grid-cols-3 gap-12 text-center'>
							<div className='p-6'>
								<div className='w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-accent'>
									<Film className='w-8 h-8' />
								</div>
								<h3 className='text-xl font-bold mb-3'>Vast Library</h3>
								<p className='text-muted-foreground'>
									Access thousands of titles across Korean and Chinese cinema
									with real-time updates.
								</p>
							</div>
							<div className='p-6'>
								<div className='w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-accent'>
									<CheckCircle className='w-8 h-8' />
								</div>
								<h3 className='text-xl font-bold mb-3'>Track Progress</h3>
								<p className='text-muted-foreground'>
									Never lose your spot. Mark episodes as watched and manage your
									personal watchlist.
								</p>
							</div>
							<div className='p-6'>
								<div className='w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-accent'>
									<Sparkles className='w-8 h-8' />
								</div>
								<h3 className='text-xl font-bold mb-3'>AI Recommends</h3>
								<p className='text-muted-foreground'>
									Our smart recommendation engine suggests your next favorite
									based on your unique taste.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Movies */}
				<section className='py-16 bg-background'>
					<div className='container mx-auto px-4'>
						<div className='flex items-center justify-between mb-8'>
							<div className='flex items-center gap-3'>
								<div className='p-2 rounded-lg bg-primary/20 text-accent'>
									<Film className='w-6 h-6' />
								</div>
								<h2 className='text-2xl font-headline font-bold'>Movies</h2>
							</div>
							<Button
								variant='ghost'
								className='text-accent hover:text-accent/80 font-medium'
							>
								View All
							</Button>
						</div>

						<Tabs defaultValue='korean' className='w-full'>
							<TabsList className='bg-primary/10 mb-8'>
								<TabsTrigger value='korean'>Korean</TabsTrigger>
								<TabsTrigger value='chinese'>Chinese</TabsTrigger>
							</TabsList>

							<TabsContent value='korean'>
								<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
									{koreanMovies.slice(0, 12).map((item) => (
										<ContentCard key={item.id} content={item} type='movie' />
									))}
								</div>
							</TabsContent>

							<TabsContent value='chinese'>
								<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
									{chineseMovies.slice(0, 12).map((item) => (
										<ContentCard key={item.id} content={item} type='movie' />
									))}
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</section>
			</main>

			<footer className='border-t py-12 bg-white/50'>
				<div className='container mx-auto px-4 text-center'>
					<div className='flex items-center justify-center gap-2 mb-4'>
						<div className='w-6 h-6 rounded-full bg-primary' />
						<span className='font-headline font-bold text-lg'>
							EastAsian Serenity Tracker
						</span>
					</div>
					<p className='text-sm text-muted-foreground'>
						© {new Date().getFullYear()} EastAsian Serenity Tracker. All rights
						reserved. Data from TMDb.
					</p>
				</div>
			</footer>
		</div>
	);
}
