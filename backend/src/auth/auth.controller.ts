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
import { AuthService } from './auth.service';
import { AuthenticatedGuard } from './authenticated.guard';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { Request, Response } from 'express';

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
	async register(@Req() req: Request, @Body() dto: RegisterDto) {
		const user = await this.authService.register(
			dto.email,
			dto.password,
			dto.displayName,
		);
		return new Promise<void>((resolve, reject) => {
			req.logIn(user, (err) => {
				if (err) return reject(err);
				resolve();
			});
		}).then(() => this.sanitizeUser(user));
	}

	@UseGuards(AuthGuard('local'))
	@Post('login')
	@HttpCode(HttpStatus.OK)
	login(@Req() req: Request) {
		return this.sanitizeUser(req.user as any);
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
	async logout(@Req() req: Request) {
		await new Promise<void>((resolve, reject) => {
			req.logOut((err) => {
				if (err) return reject(err);
				resolve();
			});
		});
		await new Promise<void>((resolve) => {
			req.session.destroy(() => resolve());
		});
		return { message: 'Logged out' };
	}

	@Get('me')
	@UseGuards(AuthenticatedGuard)
	me(@Req() req: Request) {
		return this.sanitizeUser(req.user as any);
	}

	private sanitizeUser(user: any) {
		const { passwordHash, ...safe } = user;
		return safe;
	}
}
