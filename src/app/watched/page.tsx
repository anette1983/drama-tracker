'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { CheckCircle, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/tmdb';

interface WatchedItem {
	id: string;
	contentId: string;
	contentType: 'movie' | 'tv';
	title: string;
	posterPath: string | null;
	progress: number;
	rating: number | null;
	review: string | null;
	watchedAt: string;
}

export default function WatchedPage() {
	const { user, loading: authLoading } = useAuth();
	const [items, setItems] = useState<WatchedItem[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [status, setStatus] = useState<string>('all');
	const [loading, setLoading] = useState(true);
	const [removingId, setRemovingId] = useState<string | null>(null);

	useEffect(() => {
		if (authLoading) return;
		if (!user) {
			setLoading(false);
			return;
		}
		setLoading(true);
		const apiStatus = status === 'all' ? undefined : status;
		api.watched
			.list(page, 20, apiStatus)
			.then((res) => {
				setItems(res.items);
				setTotal(res.total);
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	}, [user, authLoading, page, status]);

	const handleRemove = async (id: string) => {
		setRemovingId(id);
		try {
			await api.watched.remove(id);
			setItems((prev) => prev.filter((item) => item.id !== id));
			setTotal((prev) => prev - 1);
		} catch {
		} finally {
			setRemovingId(null);
		}
	};

	const handleStatusChange = (newStatus: string) => {
		setStatus(newStatus);
		setPage(1);
	};

	const totalPages = Math.ceil(total / 20);

	return (
		<div className='min-h-screen flex flex-col bg-background'>
			<Navbar />
			<main className='flex-1 container mx-auto px-4 py-8'>
				<header className='mb-10'>
					<div className='flex items-center gap-3 mb-2'>
						<div className='p-2 rounded-lg bg-green-100 text-green-600'>
							<CheckCircle className='w-6 h-6' />
						</div>
						<h1 className='text-3xl font-headline font-bold'>
							Watched History
						</h1>
					</div>
					<p className='text-muted-foreground'>
						{user
							? `${total} title${total !== 1 ? 's' : ''} tracked`
							: 'Sign in to track your progress.'}
					</p>
				</header>

				{!user && !authLoading && (
					<div className='text-center py-20 rounded-2xl bg-primary/5 border border-dashed border-primary/20'>
						<CheckCircle className='w-12 h-12 text-primary mx-auto mb-4' />
						<p className='text-muted-foreground mb-2'>
							You need to sign in to see your watched history.
						</p>
					</div>
				)}

				{user && (
					<Tabs
						value={status}
						onValueChange={handleStatusChange}
						className='mb-8'
					>
						<TabsList className='bg-primary/10'>
							<TabsTrigger value='all'>All</TabsTrigger>
							<TabsTrigger value='in-progress'>In Progress</TabsTrigger>
							<TabsTrigger value='completed'>Completed</TabsTrigger>
						</TabsList>
					</Tabs>
				)}

				{user && loading && (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
						{Array.from({ length: 6 }).map((_, i) => (
							<div
								key={i}
								className='h-40 rounded-xl bg-primary/10 animate-pulse'
							/>
						))}
					</div>
				)}

				{user && !loading && items.length === 0 && (
					<div className='text-center py-20 rounded-2xl bg-primary/5 border border-dashed border-primary/20'>
						<CheckCircle className='w-12 h-12 text-primary mx-auto mb-4' />
						<p className='text-lg font-semibold mb-2'>Nothing here yet</p>
						<p className='text-muted-foreground mb-6'>
							Start tracking your dramas and movies.
						</p>
						<Link href='/search?mode=popular'>
							<Button className='bg-accent text-white'>Browse Popular</Button>
						</Link>
					</div>
				)}

				{user && !loading && items.length > 0 && (
					<>
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
							{items.map((item) => (
								<Card
									key={item.id}
									className='group overflow-hidden border-none shadow-md hover:shadow-xl transition-all bg-white/50 hover:bg-white'
								>
									<Link href={`/content/${item.contentType}/${item.contentId}`}>
										<div className='flex gap-4 p-4'>
											<div className='w-20 h-28 rounded-lg overflow-hidden relative shrink-0 shadow-sm'>
												<Image
													src={
														item.posterPath
															? getImageUrl(item.posterPath)
															: '/placeholder.svg'
													}
													alt={item.title}
													fill
													className='object-cover'
												/>
											</div>
											<div className='flex-1 min-w-0'>
												<div className='flex items-start justify-between gap-2'>
													<h3 className='font-semibold line-clamp-1 group-hover:text-accent transition-colors'>
														{item.title}
													</h3>
													<Badge variant='outline' className='shrink-0 text-xs'>
														{item.contentType.toUpperCase()}
													</Badge>
												</div>
												<div className='mt-2 space-y-2'>
													<div>
														<div className='flex justify-between text-xs text-muted-foreground mb-1'>
															<span>Progress</span>
															<span>{item.progress}%</span>
														</div>
														<Progress value={item.progress} className='h-2' />
													</div>
													{item.rating && (
														<div className='flex gap-1'>
															{[1, 2, 3, 4, 5].map((s) => (
																<Star
																	key={s}
																	className={`w-3.5 h-3.5 ${s <= item.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
																/>
															))}
														</div>
													)}
													{item.review && (
														<p className='text-xs text-muted-foreground line-clamp-2 italic'>
															&ldquo;{item.review}&rdquo;
														</p>
													)}
												</div>
											</div>
										</div>
									</Link>
									<div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
										<Button
											variant='ghost'
											size='icon'
											className='bg-black/40 hover:bg-red-500 text-white rounded-full w-8 h-8'
											onClick={(e) => {
												e.preventDefault();
												handleRemove(item.id);
											}}
											disabled={removingId === item.id}
										>
											<Trash2 className='w-4 h-4' />
										</Button>
									</div>
								</Card>
							))}
						</div>

						{totalPages > 1 && (
							<div className='flex justify-center gap-2 mt-10'>
								<Button
									variant='outline'
									disabled={page <= 1}
									onClick={() => setPage((p) => p - 1)}
								>
									Previous
								</Button>
								<span className='flex items-center px-4 text-sm text-muted-foreground'>
									Page {page} of {totalPages}
								</span>
								<Button
									variant='outline'
									disabled={page >= totalPages}
									onClick={() => setPage((p) => p + 1)}
								>
									Next
								</Button>
							</div>
						)}
					</>
				)}
			</main>
		</div>
	);
}
