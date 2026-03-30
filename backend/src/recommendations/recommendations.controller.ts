import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { Request } from 'express';

@Controller('recommendations')
@UseGuards(AuthenticatedGuard)
export class RecommendationsController {
	constructor(
		private readonly recommendationsService: RecommendationsService,
	) {}

	@Get()
	getRecommendations(@Req() req: Request) {
		return this.recommendationsService.getRecommendations(req.user as any);
	}
}
