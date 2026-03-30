import {
	Injectable,
	UnauthorizedException,
	ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Profile } from 'passport-google-oauth20';

@Injectable()
export class AuthService {
	constructor(private readonly usersService: UsersService) {}

	async register(
		email: string,
		password: string,
		displayName?: string,
	): Promise<User> {
		const existing = await this.usersService.findByEmail(email);
		if (existing) {
			throw new ConflictException('Email already registered');
		}

		const passwordHash = await bcrypt.hash(password, 12);
		return this.usersService.create({ email, passwordHash, displayName });
	}

	async validateLocalUser(email: string, password: string): Promise<User> {
		const user = await this.usersService.findByEmail(email);
		if (!user || !user.passwordHash) {
			throw new UnauthorizedException('Invalid email or password');
		}

		const isMatch = await bcrypt.compare(password, user.passwordHash);
		if (!isMatch) {
			throw new UnauthorizedException('Invalid email or password');
		}

		return user;
	}

	async validateGoogleUser(profile: Profile): Promise<User> {
		const googleId = profile.id;
		const email = profile.emails?.[0]?.value;
		if (!email) {
			throw new UnauthorizedException('Google account has no email');
		}

		// Check if user already linked via Google ID
		let user = await this.usersService.findByGoogleId(googleId);
		if (user) return user;

		// Check if user exists by email (link Google account)
		user = await this.usersService.findByEmail(email);
		if (user) {
			return this.usersService.update(user.id, {
				googleId,
				displayName: user.displayName || profile.displayName,
				photoURL: user.photoURL || profile.photos?.[0]?.value,
			});
		}

		// Create new user
		return this.usersService.create({
			email,
			googleId,
			displayName: profile.displayName,
			photoURL: profile.photos?.[0]?.value,
		});
	}
}
