import { forwardTo } from 'prisma-binding';
import { getUserId, Context } from '../utils/token';

export const Query = {
	products(parent: any, args: any, ctx: Context, info: any) {
		return forwardTo('db')(parent, args, ctx, info);
	},
	feed(parent: any, args: any, ctx: Context, info: any) {
		return ctx.db.query.posts({ where: { isPublished: true } }, info);
	},

	drafts(parent: any, args: any, ctx: Context, info: any) {
		const id = getUserId(ctx);

		const where = {
			isPublished: false,
			author: {
				id,
			},
		};

		return ctx.db.query.posts({ where }, info);
	},

	post(parent: any, { id }: { id: number }, ctx: Context, info: any) {
		return ctx.db.query.post({ where: { id } }, info);
	},

	me(parent: any, args: any, ctx: Context, info: any) {
		const id = getUserId(ctx);
		return ctx.db.query.user({ where: { id } }, info);
	},
};
