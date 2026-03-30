import {
	Controller,
	Get,
	Post,
	Delete,
	Param,
	Body,
	Query,
	UseGuards,
	Req,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { Request } from 'express';

@Controller('favorites')
@UseGuards(AuthenticatedGuard)
export class FavoritesController {
	constructor(private readonly favoritesService: FavoritesService) {}

	@Get()
	async list(
		@Req() req: Request,
		@Query('page') page?: string,
		@Query('limit') limit?: string,
	) {
		const [items, total] = await this.favoritesService.list(
			req.user as any,
			page ? parseInt(page, 10) : 1,
			limit ? parseInt(limit, 10) : 20,
		);
		return { items, total };
	}

	@Post()
	add(@Req() req: Request, @Body() dto: CreateFavoriteDto) {
		return this.favoritesService.add(req.user as any, dto);
	}

	@Delete(':id')
	remove(@Req() req: Request, @Param('id') id: string) {
		return this.favoritesService.remove(req.user as any, id);
	}

	@Get('check/:contentType/:contentId')
	check(
		@Req() req: Request,
		@Param('contentType') contentType: string,
		@Param('contentId') contentId: string,
	) {
		return this.favoritesService.check(req.user as any, contentType, contentId);
	}
}
