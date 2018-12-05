import Koa from 'koa';
import staticMiddleware from 'koa-static';
import { Prisma } from 'prisma-binding';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-koa';
import { importSchema } from 'graphql-import';
import { graphqlUploadKoa } from 'graphql-upload';
import resolvers from './resolvers';

const PORT = process.env.PORT || 4000;

const typeDefs = importSchema('./src/schema.graphql');
const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
	resolverValidationOptions: {
		requireResolversForResolveType: false,
	},
});

const server = new ApolloServer({
	schema,
	uploads: false,
	context: (req: any) => ({
		...req,
		db: new Prisma({
			typeDefs: './src/generated/prisma.graphql',
			endpoint:
				'https://eu1.prisma.sh/muslim-guseinov-4235e0/ecommerce-gdg/dev',
			debug: true,
			secret: 'mysecret123',
		}),
	}),
});

const app = new Koa();

app.use(
	graphqlUploadKoa({
		maxFileSize: 10000000,
		maxFiles: 20,
	})
);

app.use(staticMiddleware('/images'));

const httpServer = app.listen(
	{
		port: PORT,
	},
	() => {
		console.log(
			`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
		);
		console.log(
			`🚀 Subscriptions ready at ws://localhost:${PORT}${
				server.subscriptionsPath
			}`
		);
	}
);

server.applyMiddleware({
	app,
});

server.installSubscriptionHandlers(httpServer);
