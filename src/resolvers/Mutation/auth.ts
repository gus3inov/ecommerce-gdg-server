import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Context } from '../../utils/token';

export const auth = {
	async signup(parent: any, args: any, ctx: Context, info: any) {
		const password = await bcrypt.hash(args.password, 10);
		const user = await ctx.db.mutation.createUser({
			data: { ...args, password },
		});

		return {
			token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
			user,
		};
	},

	async login(
		parent: any,
		{ email, password }: { email: string; password: string },
		ctx: Context,
		info: any
	) {
		const user = await ctx.db.query.user({ where: { email } });
		if (!user) {
			throw new Error(`No such user found for email: ${email}`);
		}

		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			throw new Error('Invalid password');
		}

		return {
			token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
			user,
		};
	},
};
