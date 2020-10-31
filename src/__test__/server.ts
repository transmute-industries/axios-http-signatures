import fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

export const getServer = () => {
  const server: FastifyInstance<
    Server,
    IncomingMessage,
    ServerResponse
  > = fastify({});
  const opts: RouteShorthandOptions = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            valid: {
              type: 'boolean',
            },
          },
        },
      },
    },
  };

  server.get('/ping', opts, (_request, reply) => {
    reply.code(200).send({ valid: true });
  });
  return server;
};
