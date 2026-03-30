import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { WatchedModule } from '../watched/watched.module';

@Module({
	imports: [WatchedModule],
	providers: [RecommendationsService],
	controllers: [RecommendationsController],
})
export class RecommendationsModule {}
