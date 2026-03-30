import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FavoritesModule } from './favorites/favorites.module';
import { WatchedModule } from './watched/watched.module';
import { RecommendationsModule } from './recommendations/recommendations.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		ThrottlerModule.forRoot([
			{
				ttl: 60000,
				limit: 60,
			},
		]),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				const dbUrl = config.get<string>('DATABASE_URL');
				const isProduction = config.get('NODE_ENV') === 'production';
				if (dbUrl) {
					return {
						type: 'postgres' as const,
						url: dbUrl,
						autoLoadEntities: true,
						synchronize: !isProduction,
						ssl: { rejectUnauthorized: false },
					};
				}
				return {
					type: 'postgres' as const,
					host: config.get<string>('DATABASE_HOST', 'localhost'),
					port: config.get<number>('DATABASE_PORT', 5432),
					username: config.get<string>('DATABASE_USER', 'postgres'),
					password: config.get<string>('DATABASE_PASSWORD', 'postgres'),
					database: config.get<string>('DATABASE_NAME', 'drama_tracker'),
					autoLoadEntities: true,
					synchronize: !isProduction,
				};
			},
		}),
		AuthModule,
		UsersModule,
		FavoritesModule,
		WatchedModule,
		RecommendationsModule,
	],
})
export class AppModule {}
