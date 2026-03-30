import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import session = require('express-session');
import passport = require('passport');
import connectPgSimple = require('connect-pg-simple');
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CsrfMiddleware } from './common/csrf.middleware';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);
	const isProduction = configService.get('NODE_ENV') === 'production';

	if (isProduction) {
		app.getHttpAdapter().getInstance().set('trust proxy', 1);
	}

	const frontendUrl = configService.get<string>(
		'FRONTEND_URL',
		'http://localhost:9002',
	);

	app.enableCors({
		origin: frontendUrl,
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		exposedHeaders: ['X-CSRF-Token'],
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
				conString:
					configService.get('DATABASE_URL') ||
					`postgresql://${configService.get('DATABASE_USER', 'postgres')}:${configService.get('DATABASE_PASSWORD', 'postgres')}@${configService.get('DATABASE_HOST', 'localhost')}:${configService.get('DATABASE_PORT', '5432')}/${configService.get('DATABASE_NAME', 'drama_tracker')}`,
				createTableIfMissing: true,
			}),
			secret: configService.getOrThrow<string>('SESSION_SECRET'),
			resave: false,
			saveUninitialized: false,
			cookie: {
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
				httpOnly: true,
				sameSite: isProduction ? ('none' as const) : ('lax' as const),
				secure: isProduction,
			},
		}),
	);

	app.use(passport.initialize());
	app.use(passport.session());

	const csrf = new CsrfMiddleware();
	app.use((req: any, res: any, next: any) => csrf.use(req, res, next));

	const port = configService.get<number>('PORT', 3001);
	await app.listen(port);
	console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();
