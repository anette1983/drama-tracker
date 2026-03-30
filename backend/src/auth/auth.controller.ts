import {
	Controller,
	Post,
	Get,
	Req,
	Res,
	Body,
	UseGuards,
	HttpCode,
	HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { AuthenticatedGuard } from './authenticated.guard';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { Request, Response } from 'express';
import { randomBytes } from 'crypto';

class RegisterDto {
	@IsEmail()
	email: string;

	@IsString()
	@MinLength(8)
	password: string;

	@IsOptional()
	@IsString()
	displayName?: string;
}

class LoginDto {
	@IsEmail()
	email: string;

	@IsString()
	password: string;
}

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {}

	@Post('register')
	@UseGuards(ThrottlerGuard)
	@Throttle({ default: { ttl: 60000, limit: 5 } })
	async register(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Body() dto: RegisterDto,
	) {
		const user = await this.authService.register(
			dto.email,
			dto.password,
			dto.displayName,
		);
		await new Promise<void>((resolve, reject) => {
			req.logIn(user, (err) => {
				if (err) return reject(err);
				resolve();
			});
		});
		this.regenerateCsrfToken(req, res);
		return this.sanitizeUser(user);
	}

	@UseGuards(ThrottlerGuard)
	@Throttle({ default: { ttl: 60000, limit: 5 } })
	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Body() dto: LoginDto,
	) {
		const user = await this.authService.validateLocalUser(
			dto.email,
			dto.password,
		);
		await new Promise<void>((resolve, reject) => {
			req.logIn(user, (err) => {
				if (err) return reject(err);
				resolve();
			});
		});
		this.regenerateCsrfToken(req, res);
		return this.sanitizeUser(user);
	}

	@Get('google')
	@UseGuards(AuthGuard('google'))
	googleAuth() {
		// Passport redirects to Google
	}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	googleCallback(@Req() req: Request, @Res() res: Response) {
		const frontendUrl = this.configService.get<string>(
			'FRONTEND_URL',
			'http://localhost:9002',
		);
		res.redirect(`${frontendUrl}/dashboard`);
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		await new Promise<void>((resolve, reject) => {
			req.logOut((err) => {
				if (err) return reject(err);
				resolve();
			});
		});
		await new Promise<void>((resolve) => {
			req.session.destroy(() => resolve());
		});
		res.clearCookie('connect.sid');
		return { message: 'Logged out' };
	}

	@Get('me')
	@UseGuards(AuthenticatedGuard)
	me(@Req() req: Request) {
		return this.sanitizeUser(req.user as any);
	}

	private regenerateCsrfToken(req: Request, res: Response) {
		const token = randomBytes(32).toString('hex');
		req.session.csrfToken = token;
		res.setHeader('X-CSRF-Token', token);
	}

	private sanitizeUser(user: any) {
		const { passwordHash, ...safe } = user;
		return safe;
	}
}
