import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { GoogleStrategy } from './google.strategy';
import { SessionSerializer } from './session.serializer';
import { UsersModule } from '../users/users.module';

const googleStrategyProvider = {
	provide: GoogleStrategy,
	useFactory: (authService: AuthService, configService: ConfigService) => {
		const clientId = configService.get<string>('GOOGLE_CLIENT_ID');
		if (!clientId) return null;
		return new GoogleStrategy(authService, configService);
	},
	inject: [AuthService, ConfigService],
};

@Module({
	imports: [PassportModule.register({ session: true }), UsersModule],
	providers: [
		AuthService,
		LocalStrategy,
		googleStrategyProvider,
		SessionSerializer,
	],
	controllers: [AuthController],
})
export class AuthModule {}
