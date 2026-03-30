import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
	Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ContentType } from '../../common/enums';
export { ContentType };

@Entity('favorites')
@Unique(['user', 'contentId', 'contentType'])
export class FavoriteItem {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User, (user) => user.favoriteItems, { onDelete: 'CASCADE' })
	user: User;

	@Column()
	contentId: string;

	@Column({ type: 'enum', enum: ContentType })
	contentType: ContentType;

	@Column()
	title: string;

	@Column({ nullable: true })
	posterPath: string;

	@CreateDateColumn()
	addedAt: Date;
}
