import * as bcrypt from 'bcryptjs';
import { Context, createToken, getUserId } from '../../utils/token';

export const auth = {
	async refreshToken(parent: any, args: any, ctx: any, info: any) {
		const userId = getUserId(ctx);
		return {
			token: createToken(userId),
			userId,
		};
	},
	async signup(parent: any, args: any, ctx: Context, info: any) {
		const password = await bcrypt.hash(args.password, 10);
		const user = await ctx.db.mutation.createUser({
			data: { ...args, password },
		});

		return {
			token: createToken(user.id),
			user,
		};
	},

	async login(parent: any, { email, password }: any, ctx: Context, info: any) {
		const user = await ctx.db.query.user({ where: { email } });
		if (!user) {
			return {
				error: {
					field: 'email',
					msg: 'No user found',
				},
			};
		}

		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			return {
				error: {
					field: 'password',
					msg: 'Invalid password',
				},
			};
		}

		return {
			payload: {
				token: createToken(user.id),
				user,
			},
		};
	},
};
