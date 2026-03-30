import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import session = require('express-session');
import passport = require('passport');
import connectPgSimple = require('connect-pg-simple');
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);
	const frontendUrl = configService.get<string>(
		'FRONTEND_URL',
		'http://localhost:9002',
	);

	app.enableCors({
		origin: frontendUrl,
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	});

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	const PgStore = connectPgSimple(session);

	app.use(
		session({
			store: new PgStore({
				conString: `postgresql://${configService.get('DATABASE_USER', 'postgres')}:${configService.get('DATABASE_PASSWORD', 'postgres')}@${configService.get('DATABASE_HOST', 'localhost')}:${configService.get('DATABASE_PORT', '5432')}/${configService.get('DATABASE_NAME', 'drama_tracker')}`,
				createTableIfMissing: true,
			}),
			secret: configService.get<string>(
				'SESSION_SECRET',
				'dev-secret-change-me',
			),
			resave: false,
			saveUninitialized: false,
			cookie: {
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
				httpOnly: true,
				sameSite: 'lax',
				secure: configService.get('NODE_ENV') === 'production',
			},
		}),
	);

	app.use(passport.initialize());
	app.use(passport.session());

	const port = configService.get<number>('PORT', 3001);
	await app.listen(port);
	console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();
