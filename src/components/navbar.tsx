'use client';

import Link from 'next/link';
import {
	Search,
	Heart,
	CheckCircle,
	Home,
	User,
	Menu,
	LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AuthDialog } from '@/components/auth-dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navbar() {
	const [searchQuery, setSearchQuery] = useState('');
	const [authOpen, setAuthOpen] = useState(false);
	const router = useRouter();
	const { user, loading, logout } = useAuth();

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
		}
	};

	const handleLogout = async () => {
		await logout();
		router.push('/');
	};

	return (
		<>
			<nav className='sticky top-0 z-50 w-full border-b glass-morphism'>
				<div className='container mx-auto px-4 h-16 flex items-center justify-between gap-4'>
					<Link href='/' className='flex items-center gap-2 shrink-0'>
						<div className='w-8 h-8 rounded-full bg-primary flex items-center justify-center'>
							<div className='w-4 h-4 rounded-full bg-accent' />
						</div>
						<span className='font-headline font-bold text-xl tracking-tight hidden sm:block'>
							Serenity Tracker
						</span>
					</Link>

					<form
						onSubmit={handleSearch}
						className='flex-1 max-w-md relative hidden md:block'
					>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
						<Input
							placeholder='Search dramas or movies...'
							className='pl-10 bg-white/50 border-primary/20 focus-visible:ring-accent'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</form>

					<div className='flex items-center gap-1 sm:gap-2'>
						<Link href='/dashboard'>
							<Button variant='ghost' size='icon' title='Dashboard'>
								<Home className='w-5 h-5' />
							</Button>
						</Link>
						<Link href='/favorites'>
							<Button variant='ghost' size='icon' title='Favorites'>
								<Heart className='w-5 h-5' />
							</Button>
						</Link>
						<Link href='/watched'>
							<Button variant='ghost' size='icon' title='Watched History'>
								<CheckCircle className='w-5 h-5' />
							</Button>
						</Link>
						<div className='h-6 w-px bg-border mx-1 hidden sm:block' />

						{!loading && user ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='ghost' size='icon' className='rounded-full'>
										<Avatar className='w-8 h-8'>
											<AvatarImage
												src={user.photoURL}
												alt={user.displayName || user.email}
											/>
											<AvatarFallback className='bg-accent text-white text-xs'>
												{(user.displayName || user.email)
													.charAt(0)
													.toUpperCase()}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end'>
									<DropdownMenuItem className='font-medium' disabled>
										{user.displayName || user.email}
									</DropdownMenuItem>
									<DropdownMenuItem onClick={handleLogout}>
										<LogOut className='w-4 h-4 mr-2' />
										Sign Out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : !loading ? (
							<>
								<Button
									variant='outline'
									className='hidden sm:flex border-accent text-accent hover:bg-accent/10'
									onClick={() => setAuthOpen(true)}
								>
									Sign In
								</Button>
								<Button
									variant='ghost'
									size='icon'
									className='sm:hidden'
									onClick={() => setAuthOpen(true)}
								>
									<Menu className='w-5 h-5' />
								</Button>
							</>
						) : null}
					</div>
				</div>
			</nav>
			<AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
		</>
	);
}
