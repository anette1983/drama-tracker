import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Param,
	Body,
	Query,
	UseGuards,
	Req,
} from '@nestjs/common';
import { WatchedService } from './watched.service';
import { CreateWatchedDto, UpdateWatchedDto } from './dto/watched.dto';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { Request } from 'express';

@Controller('watched')
@UseGuards(AuthenticatedGuard)
export class WatchedController {
	constructor(private readonly watchedService: WatchedService) {}

	@Get()
	async list(
		@Req() req: Request,
		@Query('page') page?: string,
		@Query('limit') limit?: string,
		@Query('status') status?: 'in-progress' | 'completed',
	) {
		const [items, total] = await this.watchedService.list(
			req.user as any,
			page ? parseInt(page, 10) : 1,
			limit ? parseInt(limit, 10) : 20,
			status,
		);
		return { items, total };
	}

	@Post()
	add(@Req() req: Request, @Body() dto: CreateWatchedDto) {
		return this.watchedService.add(req.user as any, dto);
	}

	@Patch(':id')
	update(
		@Req() req: Request,
		@Param('id') id: string,
		@Body() dto: UpdateWatchedDto,
	) {
		return this.watchedService.update(req.user as any, id, dto);
	}

	@Delete(':id')
	remove(@Req() req: Request, @Param('id') id: string) {
		return this.watchedService.remove(req.user as any, id);
	}

	@Get('check/:contentType/:contentId')
	check(
		@Req() req: Request,
		@Param('contentType') contentType: string,
		@Param('contentId') contentId: string,
	) {
		return this.watchedService.check(req.user as any, contentType, contentId);
	}
}
