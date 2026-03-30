import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ContentType } from '../entities/favorite.entity';

export class CreateFavoriteDto {
	@IsNotEmpty()
	@IsString()
	contentId: string;

	@IsEnum(ContentType)
	contentType: ContentType;

	@IsNotEmpty()
	@IsString()
	title: string;

	@IsOptional()
	@IsString()
	posterPath?: string;
}
