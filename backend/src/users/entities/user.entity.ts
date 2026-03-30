import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
} from 'typeorm';
import { WatchedItem } from '../../watched/entities/watched-item.entity';
import { FavoriteItem } from '../../favorites/entities/favorite.entity';

export enum LanguagePreference {
	Korean = 'Korean',
	Chinese = 'Chinese',
}

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	email: string;

	@Column({ nullable: true })
	displayName: string;

	@Column({ nullable: true })
	photoURL: string;

	@Column({ type: 'enum', enum: LanguagePreference, nullable: true })
	languagePreference: LanguagePreference;

	@Column({ nullable: true })
	passwordHash: string;

	@Column({ nullable: true, unique: true })
	googleId: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@OneToMany(() => WatchedItem, (watched) => watched.user)
	watchedItems: WatchedItem[];

	@OneToMany(() => FavoriteItem, (fav) => fav.user)
	favoriteItems: FavoriteItem[];
}
