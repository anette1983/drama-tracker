import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsNumber,
	Min,
	Max,
} from 'class-validator';
import { ContentType } from '../../common/enums';

export class CreateWatchedDto {
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

	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(100)
	progress?: number;

	@IsOptional()
	@IsNumber()
	@Min(1)
	@Max(5)
	rating?: number;

	@IsOptional()
	@IsString()
	review?: string;
}

export class UpdateWatchedDto {
	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(100)
	progress?: number;

	@IsOptional()
	@IsNumber()
	@Min(1)
	@Max(5)
	rating?: number;

	@IsOptional()
	@IsString()
	review?: string;
}
