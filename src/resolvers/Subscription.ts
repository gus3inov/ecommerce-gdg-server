import { Context } from '../utils/token';

export const Subscription = {
	feedSubscription: {
		subscribe: (parent: any, args: any, ctx: Context, info: any) => {
			return ctx.db.subscription.post(
				{
					where: {
						node: {
							isPublished: true,
						},
					},
				},
				info
			);
		},
	},
};
