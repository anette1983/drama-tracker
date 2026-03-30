'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuthDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
	const { login, register } = useAuth();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');
		setLoading(true);
		const form = new FormData(e.currentTarget);
		try {
			await login(form.get('email') as string, form.get('password') as string);
			onOpenChange(false);
		} catch (err: any) {
			setError(err.message || 'Login failed');
		} finally {
			setLoading(false);
		}
	};

	const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');
		setLoading(true);
		const form = new FormData(e.currentTarget);
		try {
			await register(
				form.get('email') as string,
				form.get('password') as string,
				(form.get('displayName') as string) || undefined,
			);
			onOpenChange(false);
		} catch (err: any) {
			setError(err.message || 'Registration failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Welcome to Serenity Tracker</DialogTitle>
				</DialogHeader>

				<Tabs
					defaultValue='login'
					className='w-full'
					onValueChange={() => setError('')}
				>
					<TabsList className='w-full'>
						<TabsTrigger value='login' className='flex-1'>
							Sign In
						</TabsTrigger>
						<TabsTrigger value='register' className='flex-1'>
							Register
						</TabsTrigger>
					</TabsList>

					<TabsContent value='login' className='space-y-4 mt-4'>
						<form onSubmit={handleLogin} className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='login-email'>Email</Label>
								<Input id='login-email' name='email' type='email' required />
							</div>
							<div className='space-y-2'>
								<Label htmlFor='login-password'>Password</Label>
								<Input
									id='login-password'
									name='password'
									type='password'
									required
								/>
							</div>
							{error && <p className='text-sm text-destructive'>{error}</p>}
							<Button
								type='submit'
								className='w-full bg-accent text-white'
								disabled={loading}
							>
								{loading ? 'Signing in...' : 'Sign In'}
							</Button>
						</form>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<span className='w-full border-t' />
							</div>
							<div className='relative flex justify-center text-xs uppercase'>
								<span className='bg-background px-2 text-muted-foreground'>
									Or
								</span>
							</div>
						</div>
						<Button
							variant='outline'
							className='w-full'
							onClick={() => {
								window.location.href = api.auth.googleUrl;
							}}
						>
							Continue with Google
						</Button>
					</TabsContent>

					<TabsContent value='register' className='space-y-4 mt-4'>
						<form onSubmit={handleRegister} className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='reg-name'>Display Name</Label>
								<Input id='reg-name' name='displayName' />
							</div>
							<div className='space-y-2'>
								<Label htmlFor='reg-email'>Email</Label>
								<Input id='reg-email' name='email' type='email' required />
							</div>
							<div className='space-y-2'>
								<Label htmlFor='reg-password'>Password (min 8 chars)</Label>
								<Input
									id='reg-password'
									name='password'
									type='password'
									required
									minLength={8}
								/>
							</div>
							{error && <p className='text-sm text-destructive'>{error}</p>}
							<Button
								type='submit'
								className='w-full bg-accent text-white'
								disabled={loading}
							>
								{loading ? 'Creating account...' : 'Create Account'}
							</Button>
						</form>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
