import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteItem } from './entities/favorite.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FavoritesService {
	constructor(
		@InjectRepository(FavoriteItem)
		private readonly favoritesRepository: Repository<FavoriteItem>,
	) {}

	async add(user: User, dto: CreateFavoriteDto): Promise<FavoriteItem> {
		const existing = await this.favoritesRepository.findOne({
			where: {
				user: { id: user.id },
				contentId: dto.contentId,
				contentType: dto.contentType,
			},
		});
		if (existing) {
			throw new ConflictException('Already in favorites');
		}
		const item = this.favoritesRepository.create({ ...dto, user });
		return this.favoritesRepository.save(item);
	}

	async remove(user: User, id: string): Promise<void> {
		await this.favoritesRepository.delete({ id, user: { id: user.id } });
	}

	list(user: User, page = 1, limit = 20): Promise<[FavoriteItem[], number]> {
		return this.favoritesRepository.findAndCount({
			where: { user: { id: user.id } },
			order: { addedAt: 'DESC' },
			skip: (page - 1) * limit,
			take: limit,
		});
	}

	async check(
		user: User,
		contentType: string,
		contentId: string,
	): Promise<{ favorited: boolean; id?: string }> {
		const item = await this.favoritesRepository.findOne({
			where: {
				user: { id: user.id },
				contentId,
				contentType: contentType as any,
			},
		});
		return item ? { favorited: true, id: item.id } : { favorited: false };
	}
}
