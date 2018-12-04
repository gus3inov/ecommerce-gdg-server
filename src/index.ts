import * as Koa from 'koa';
import * as staticMiddleware from 'koa-static';
import { Prisma } from 'prisma-binding';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-koa';
import { createServer } from 'http';
import { importSchema } from 'graphql-import';
import { graphqlUploadKoa } from 'graphql-upload';
import resolvers from './resolvers';

const PORT = process.env.PORT || 4000;

const typeDefs = importSchema('./src/schema.graphql');
const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});

const server = new ApolloServer({
	schema,
	uploads: false,
	context: (req: any) => ({
		...req,
		db: new Prisma({
			typeDefs: './src/generated/prisma.graphql',
			endpoint: process.env.PRISMA_ENDPOINT,
			debug: true,
			secret: process.env.PRISMA_SECRET,
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

server.applyMiddleware({
	app,
});

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(
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
