import Fastify, { FastifyInstance } from 'fastify';
import avatarRoutes from '../../routes/avatar.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: false,
  });

  // Register routes
  await app.register(avatarRoutes, { prefix: '/api' });

  // Global error handler
  app.setErrorHandler((error, _request, reply) => {
    reply.status(error.statusCode || 500).send({
      error: error.name,
      message: error.message,
      statusCode: error.statusCode || 500,
    });
  });

  return app;
}
