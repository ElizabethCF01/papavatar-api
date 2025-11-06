import { FastifyInstance } from "fastify";
import { AvatarGenerator } from "./avatar.service.js";

interface AvatarParams {
  identifier: string;
}

interface AvatarQuery {
  size?: string;
}

export default async function avatarRoutes(fastify: FastifyInstance) {
  // GET avatar by identifier
  fastify.get<{ Params: AvatarParams; Querystring: AvatarQuery }>(
    "/avatar/:identifier",
    async (request, reply) => {
      const { identifier } = request.params;
      const { size } = request.query;

      const avatarSize = size ? parseInt(size, 10) : 200;

      if (isNaN(avatarSize) || avatarSize < 50 || avatarSize > 1000) {
        reply.code(400).send({
          error: "Invalid size",
          message: "Size must be a number between 50 and 1000",
        });
        return;
      }

      try {
        const generator = new AvatarGenerator(identifier);
        const svg = generator.generateSVG(avatarSize);

        reply
          .type("image/svg+xml")
          .header("Cache-Control", "public, max-age=31536000, immutable")
          .send(svg);
      } catch (error) {
        fastify.log.error(error);
        reply.code(500).send({
          error: "Generation failed",
          message: "Failed to generate avatar",
        });
      }
    }
  );

  // GET avatar features/metadata
  fastify.get<{ Params: AvatarParams }>(
    "/avatar/:identifier/info",
    async (request, reply) => {
      const { identifier } = request.params;

      try {
        const generator = new AvatarGenerator(identifier);
        const features = generator.getFeatures();

        return {
          identifier,
          features,
        };
      } catch (error) {
        fastify.log.error(error);
        reply.code(500).send({
          error: "Generation failed",
          message: "Failed to generate avatar info",
        });
      }
    }
  );
}
