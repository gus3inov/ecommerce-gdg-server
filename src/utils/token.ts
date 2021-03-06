import * as jwt from 'jsonwebtoken';
import { Prisma } from '../generated/prisma';

export interface Context {
	db: Prisma;
	ctx: {
		request: any;
	};
}

export function getUserId(ctx: Context) {
	const Authorization = ctx.ctx.request.get('Authorization');
	let token = '';

	if (Authorization) {
		token = Authorization.replace('Bearer ', '');
	}

	if (token) {
		const { userId } = jwt.verify(token, 'mysecret123') as {
			userId: string;
		};
		return userId;
	}

	throw new AuthError();
}

export const createToken = (userId: string) =>
	jwt.sign({ userId, expiresIn: '7d' }, 'mysecret123');

export class AuthError extends Error {
	constructor() {
		super('Not authorized');
	}
}
