import { Query } from './Query';
import { Subscription } from './Subscription';
import { auth } from './Mutation/auth';
import { product } from './Mutation/product';
import { AuthPayload } from './AuthPayload';

export default {
	Query,
	Mutation: {
		...auth,
		...product,
	},
	Subscription,
	AuthPayload,
};
