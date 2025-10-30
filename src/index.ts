import Fastify from "fastify";
import { config } from "./config/config.js";
import avatarRoutes from "./routes/avatar.js";

const fastify = Fastify({
  logger: {
    level: config.logLevel,
  },
});

// Register routes
fastify.register(avatarRoutes, { prefix: "/api" });

// Global error handler
fastify.setErrorHandler((error, _request, reply) => {
  fastify.log.error(error);
  reply.status(error.statusCode || 500).send({
    error: error.name,
    message: error.message,
    statusCode: error.statusCode || 500,
  });
});

// Start server
const start = async () => {
  try {
    await fastify.listen({
      port: config.port,
      host: config.host,
    });
    fastify.log.info(`Server listening on ${config.host}:${config.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
