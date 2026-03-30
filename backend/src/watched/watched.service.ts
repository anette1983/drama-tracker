import {
	Injectable,
	ConflictException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchedItem } from './entities/watched-item.entity';
import { CreateWatchedDto, UpdateWatchedDto } from './dto/watched.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WatchedService {
	constructor(
		@InjectRepository(WatchedItem)
		private readonly watchedRepository: Repository<WatchedItem>,
	) {}

	async add(user: User, dto: CreateWatchedDto): Promise<WatchedItem> {
		const existing = await this.watchedRepository.findOne({
			where: {
				user: { id: user.id },
				contentId: dto.contentId,
				contentType: dto.contentType,
			},
		});
		if (existing) {
			throw new ConflictException('Already in watched list');
		}
		const item = this.watchedRepository.create({ ...dto, user });
		return this.watchedRepository.save(item);
	}

	async update(
		user: User,
		id: string,
		dto: UpdateWatchedDto,
	): Promise<WatchedItem> {
		const item = await this.watchedRepository.findOne({
			where: { id, user: { id: user.id } },
		});
		if (!item) {
			throw new NotFoundException('Watched item not found');
		}
		Object.assign(item, dto);
		return this.watchedRepository.save(item);
	}

	async remove(user: User, id: string): Promise<void> {
		await this.watchedRepository.delete({ id, user: { id: user.id } });
	}

	list(
		user: User,
		page = 1,
		limit = 20,
		status?: 'in-progress' | 'completed',
	): Promise<[WatchedItem[], number]> {
		const qb = this.watchedRepository
			.createQueryBuilder('w')
			.where('w.userId = :userId', { userId: user.id });

		if (status === 'completed') {
			qb.andWhere('w.progress >= 100');
		} else if (status === 'in-progress') {
			qb.andWhere('w.progress < 100');
		}

		return qb
			.orderBy('w.updatedAt', 'DESC')
			.skip((page - 1) * limit)
			.take(limit)
			.getManyAndCount();
	}

	async check(
		user: User,
		contentType: string,
		contentId: string,
	): Promise<{ watched: boolean; id?: string; progress?: number }> {
		const item = await this.watchedRepository.findOne({
			where: {
				user: { id: user.id },
				contentId,
				contentType: contentType as any,
			},
		});
		return item
			? { watched: true, id: item.id, progress: item.progress }
			: { watched: false };
	}

	findAllByUser(user: User): Promise<WatchedItem[]> {
		return this.watchedRepository.find({
			where: { user: { id: user.id } },
			order: { updatedAt: 'DESC' },
		});
	}
}
