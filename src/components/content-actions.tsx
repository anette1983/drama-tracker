'use client';

import {
	useState,
	useEffect,
	createContext,
	useContext,
	type ReactNode,
} from 'react';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Heart, CheckCircle, Star, Loader2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ContentState {
	contentId: string;
	contentType: 'movie' | 'tv';
	title: string;
	posterPath: string | null;
	favorited: boolean;
	favoriteId: string | null;
	watched: boolean;
	watchedId: string | null;
	progress: number;
	rating: number;
	review: string;
	toggleFavorite: () => Promise<void>;
	toggleWatched: () => Promise<void>;
	saveProgress: () => Promise<void>;
	setProgress: (v: number) => void;
	setRating: (v: number) => void;
	setReview: (v: string) => void;
	loadingFav: boolean;
	loadingWatch: boolean;
	saving: boolean;
}

const ContentActionsContext = createContext<ContentState | null>(null);

export function ContentActionsProvider({
	contentId,
	contentType,
	title,
	posterPath,
	children,
}: {
	contentId: string;
	contentType: 'movie' | 'tv';
	title: string;
	posterPath: string | null;
	children: ReactNode;
}) {
	const { user } = useAuth();
	const { toast } = useToast();

	const [favorited, setFavorited] = useState(false);
	const [favoriteId, setFavoriteId] = useState<string | null>(null);
	const [watched, setWatched] = useState(false);
	const [watchedId, setWatchedId] = useState<string | null>(null);
	const [progress, setProgress] = useState(0);
	const [rating, setRating] = useState(0);
	const [review, setReview] = useState('');
	const [loadingFav, setLoadingFav] = useState(false);
	const [loadingWatch, setLoadingWatch] = useState(false);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (!user) return;
		api.favorites
			.check(contentType, contentId)
			.then((res) => {
				setFavorited(res.favorited);
				setFavoriteId(res.id || null);
			})
			.catch(() => {});

		api.watched
			.check(contentType, contentId)
			.then((res) => {
				setWatched(res.watched);
				setWatchedId(res.id || null);
				if (res.progress) setProgress(res.progress);
			})
			.catch(() => {});
	}, [user, contentId, contentType]);

	const toggleFavorite = async () => {
		if (!user) {
			toast({
				title: 'Sign in required',
				description: 'Please sign in to add favorites.',
			});
			return;
		}
		setLoadingFav(true);
		try {
			if (favorited && favoriteId) {
				await api.favorites.remove(favoriteId);
				setFavorited(false);
				setFavoriteId(null);
				toast({ title: 'Removed from favorites' });
			} else {
				const res = await api.favorites.add({
					contentId,
					contentType,
					title,
					posterPath: posterPath || undefined,
				});
				setFavorited(true);
				setFavoriteId(res.id);
				toast({ title: 'Added to favorites!' });
			}
		} catch (err: any) {
			toast({
				title: 'Error',
				description: err.message,
				variant: 'destructive',
			});
		} finally {
			setLoadingFav(false);
		}
	};

	const toggleWatched = async () => {
		if (!user) {
			toast({
				title: 'Sign in required',
				description: 'Please sign in to track content.',
			});
			return;
		}
		setLoadingWatch(true);
		try {
			if (watched && watchedId) {
				await api.watched.remove(watchedId);
				setWatched(false);
				setWatchedId(null);
				setProgress(0);
				setRating(0);
				setReview('');
				toast({ title: 'Removed from watched list' });
			} else {
				const res = await api.watched.add({
					contentId,
					contentType,
					title,
					posterPath: posterPath || undefined,
				});
				setWatched(true);
				setWatchedId(res.id);
				toast({ title: 'Marked as watched!' });
			}
		} catch (err: any) {
			toast({
				title: 'Error',
				description: err.message,
				variant: 'destructive',
			});
		} finally {
			setLoadingWatch(false);
		}
	};

	const saveProgress = async () => {
		if (!watchedId) return;
		setSaving(true);
		try {
			await api.watched.update(watchedId, {
				progress,
				rating: rating || undefined,
				review: review || undefined,
			});
			toast({ title: 'Progress saved!' });
		} catch (err: any) {
			toast({
				title: 'Error',
				description: err.message,
				variant: 'destructive',
			});
		} finally {
			setSaving(false);
		}
	};

	return (
		<ContentActionsContext.Provider
			value={{
				contentId,
				contentType,
				title,
				posterPath,
				favorited,
				favoriteId,
				watched,
				watchedId,
				progress,
				rating,
				review,
				toggleFavorite,
				toggleWatched,
				saveProgress,
				setProgress,
				setRating,
				setReview,
				loadingFav,
				loadingWatch,
				saving,
			}}
		>
			{children}
		</ContentActionsContext.Provider>
	);
}

function useContentActions() {
	const ctx = useContext(ContentActionsContext);
	if (!ctx)
		throw new Error(
			'useContentActions must be used within ContentActionsProvider',
		);
	return ctx;
}

export function HeroButtons() {
	const {
		favorited,
		watched,
		toggleFavorite,
		toggleWatched,
		loadingFav,
		loadingWatch,
	} = useContentActions();

	return (
		<div className='flex flex-wrap gap-4'>
			<Button
				size='lg'
				className={`gap-2 rounded-full h-12 px-8 ${watched ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-accent hover:bg-accent/90 text-white'}`}
				onClick={toggleWatched}
				disabled={loadingWatch}
			>
				{loadingWatch ? (
					<Loader2 className='w-5 h-5 animate-spin' />
				) : (
					<CheckCircle className='w-5 h-5' />
				)}
				{watched ? 'Watching' : 'Mark Watched'}
			</Button>
			<Button
				size='lg'
				variant='outline'
				className={`gap-2 rounded-full h-12 px-8 ${favorited ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' : 'bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20'}`}
				onClick={toggleFavorite}
				disabled={loadingFav}
			>
				{loadingFav ? (
					<Loader2 className='w-5 h-5 animate-spin' />
				) : (
					<Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
				)}
				{favorited ? 'Favorited' : 'Add to Favorites'}
			</Button>
		</div>
	);
}

export function ProgressCard() {
	const {
		watched,
		watchedId,
		progress,
		rating,
		review,
		setProgress,
		setRating,
		setReview,
		saveProgress,
		saving,
	} = useContentActions();
	const [hoverRating, setHoverRating] = useState(0);

	if (!watched || !watchedId) {
		return (
			<div className='space-y-4'>
				<div className='flex justify-between items-center bg-white/50 p-3 rounded-lg'>
					<span className='text-sm'>Rating</span>
					<div className='flex gap-1'>
						{[1, 2, 3, 4, 5].map((s) => (
							<Star key={s} className='w-5 h-5 text-gray-300' />
						))}
					</div>
				</div>
				<p className='text-xs text-muted-foreground text-center'>
					Mark as watched to track your progress.
				</p>
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			<div>
				<div className='flex justify-between text-sm mb-2'>
					<span>Progress</span>
					<span className='font-medium'>{progress}%</span>
				</div>
				<Slider
					value={[progress]}
					onValueChange={([v]) => setProgress(v)}
					max={100}
					step={1}
				/>
			</div>
			<div className='flex justify-between items-center bg-white/50 p-3 rounded-lg'>
				<span className='text-sm'>Rating</span>
				<div className='flex gap-1'>
					{[1, 2, 3, 4, 5].map((s) => (
						<Star
							key={s}
							className={`w-5 h-5 cursor-pointer transition-colors ${
								s <= (hoverRating || rating)
									? 'text-yellow-400 fill-current'
									: 'text-gray-300'
							}`}
							onMouseEnter={() => setHoverRating(s)}
							onMouseLeave={() => setHoverRating(0)}
							onClick={() => setRating(s)}
						/>
					))}
				</div>
			</div>
			<Textarea
				placeholder='Write a short review...'
				value={review}
				onChange={(e) => setReview(e.target.value)}
				className='resize-none'
				rows={3}
			/>
			<Button
				className='w-full bg-accent text-white h-11'
				onClick={saveProgress}
				disabled={saving}
			>
				{saving ? 'Saving...' : 'Save Progress'}
			</Button>
		</div>
	);
}
