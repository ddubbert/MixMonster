require('dotenv').config();
import fastify from "fastify";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  shouldRenderGraphiQL,
} from "graphql-helix";
import { envelop, useLogger, useSchema, useTiming } from "@envelop/core";
import { keycloakAuth} from './utils/auth';
import { makeExecutableSchema } from "@graphql-tools/schema";
import resolvers from "./resolvers/resolvers";
import { DIRECTIVES } from "@graphql-codegen/typescript-mongodb";
import typeDefs from "./schemas/schema";
import { connectDB } from './db'

const start = async () => {
  const schema = makeExecutableSchema({
    typeDefs: [DIRECTIVES, typeDefs],
    resolvers,
  });

  const getEnveloped = envelop({
    plugins: [useSchema(schema), keycloakAuth],
  });

  const app = fastify();

  const db = await connectDB();

  app.route({
    method: ['GET', 'POST'],
    url: '/graphql',
    async handler(req, res) {
      const { parse, validate, contextFactory, execute, schema } = getEnveloped({ req, db });
      const request = {
        body: req.body,
        headers: req.headers,
        method: req.method,
        query: req.query,
      };

      if (shouldRenderGraphiQL(request)) {
        res.type('text/html');
        res.send(renderGraphiQL({}));
      } else {
        const { operationName, query, variables } = getGraphQLParameters(request);
        const result = await processRequest({
          operationName,
          query,
          variables,
          request,
          schema,
          parse,
          validate,
          execute,
          contextFactory,
        });

        if (result.type === 'RESPONSE') {
          res.status(result.status);
          res.send(result.payload);
        } else {
          // You can find a complete example with GraphQL Subscriptions and stream/defer here:
          // https://github.com/contrawork/graphql-helix/blob/master/examples/fastify/server.ts
          res.send({ errors: [{ message: 'Not Supported in this demo' }] });
        }
      }
    },
  });

  app.listen(4000, () => {
    console.log(`GraphQL server is running on: http://localhost:4000/graphql`);
  });
};

start().then();
