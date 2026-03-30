import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FavoritesModule } from './favorites/favorites.module';
import { WatchedModule } from './watched/watched.module';
import { RecommendationsModule } from './recommendations/recommendations.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				type: 'postgres',
				host: config.get('DATABASE_HOST', 'localhost'),
				port: config.get<number>('DATABASE_PORT', 5432),
				username: config.get('DATABASE_USER', 'postgres'),
				password: config.get('DATABASE_PASSWORD', 'postgres'),
				database: config.get('DATABASE_NAME', 'drama_tracker'),
				autoLoadEntities: true,
				synchronize: config.get('NODE_ENV') !== 'production',
			}),
		}),
		AuthModule,
		UsersModule,
		FavoritesModule,
		WatchedModule,
		RecommendationsModule,
	],
})
export class AppModule {}
