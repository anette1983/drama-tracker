import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
	Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ContentType } from '../../common/enums';

@Entity('watched_items')
@Unique(['user', 'contentId', 'contentType'])
export class WatchedItem {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User, (user) => user.watchedItems, { onDelete: 'CASCADE' })
	user: User;

	@Column()
	contentId: string;

	@Column({ type: 'enum', enum: ContentType })
	contentType: ContentType;

	@Column()
	title: string;

	@Column({ nullable: true })
	posterPath: string;

	@Column({ type: 'float', default: 0 })
	progress: number;

	@Column({ type: 'int', nullable: true })
	rating: number;

	@Column({ type: 'text', nullable: true })
	review: string;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	watchedAt: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
