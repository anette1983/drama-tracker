import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteItem } from './entities/favorite.entity';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';

@Module({
	imports: [TypeOrmModule.forFeature([FavoriteItem])],
	providers: [FavoritesService],
	controllers: [FavoritesController],
	exports: [FavoritesService],
})
export class FavoritesModule {}
