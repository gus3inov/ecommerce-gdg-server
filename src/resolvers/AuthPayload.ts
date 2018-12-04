import { Context } from '../utils/token';

export const AuthPayload = {
	user: async ({ user: { id } }: any, args: any, ctx: Context, info: any) => {
		return ctx.db.query.user({ where: { id } }, info);
	},
};
