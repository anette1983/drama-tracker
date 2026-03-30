import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';

declare module 'express-session' {
	interface SessionData {
		csrfToken?: string;
	}
}

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const SKIP_PATHS = [
	'/auth/google/callback',
	'/auth/login',
	'/auth/register',
	'/auth/logout',
];

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		if (req.session && !req.session.csrfToken) {
			req.session.csrfToken = randomBytes(32).toString('hex');
		}

		if (req.session?.csrfToken) {
			res.setHeader('X-CSRF-Token', req.session.csrfToken);
		}

		if (
			SAFE_METHODS.has(req.method) ||
			SKIP_PATHS.some((p) => req.path.startsWith(p))
		) {
			return next();
		}

		const headerToken = req.headers['x-csrf-token'] as string;
		if (!req.session?.csrfToken || headerToken !== req.session.csrfToken) {
			throw new ForbiddenException('Invalid CSRF token');
		}

		next();
	}
}
