import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchedItem } from './entities/watched-item.entity';
import { WatchedService } from './watched.service';
import { WatchedController } from './watched.controller';

@Module({
	imports: [TypeOrmModule.forFeature([WatchedItem])],
	providers: [WatchedService],
	controllers: [WatchedController],
	exports: [WatchedService],
})
export class WatchedModule {}
