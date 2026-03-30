import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LanguagePreference } from './entities/user.entity';
import { Request } from 'express';

class UpdateProfileDto {
	@IsOptional()
	@IsString()
	displayName?: string;

	@IsOptional()
	@IsEnum(LanguagePreference)
	languagePreference?: LanguagePreference;
}

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('me')
	@UseGuards(AuthenticatedGuard)
	getProfile(@Req() req: Request) {
		return req.user;
	}

	@Patch('me')
	@UseGuards(AuthenticatedGuard)
	updateProfile(@Req() req: Request, @Body() dto: UpdateProfileDto) {
		const user = req.user as any;
		return this.usersService.update(user.id, dto);
	}
}
