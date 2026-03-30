import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Film } from 'lucide-react';
import Link from 'next/link';

export default function ContentNotFound() {
	return (
		<div className='min-h-screen bg-background flex flex-col'>
			<Navbar />
			<main className='flex-1 flex items-center justify-center'>
				<div className='text-center px-4'>
					<Film className='w-16 h-16 text-primary mx-auto mb-6' />
					<h1 className='text-3xl font-headline font-bold mb-3'>
						Content Not Found
					</h1>
					<p className='text-muted-foreground mb-8 max-w-md mx-auto'>
						The drama or movie you are looking for does not exist or may have
						been removed.
					</p>
					<div className='flex justify-center gap-4'>
						<Link href='/'>
							<Button className='bg-accent text-white'>Go Home</Button>
						</Link>
						<Link href='/search?mode=popular'>
							<Button variant='outline'>Browse Popular</Button>
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
}
