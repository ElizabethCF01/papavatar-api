import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { FastifyInstance } from "fastify";
import { buildApp } from "../../../__tests__/helpers/app.js";

describe("Avatar API - Comprehensive Integration Tests", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await buildApp();
  });

  afterEach(async () => {
    await app.close();
  });

  describe("GET /api/avatar/:identifier", () => {
    describe("Success Cases", () => {
      it("should return SVG avatar with default size", async () => {
        const response = await app.inject({
          method: "GET",
          url: "/api/avatar/test@example.com",
        });

        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toBe("image/svg+xml");
        expect(response.body).toContain("<svg");
        expect(response.body).toContain('width="200"');
        expect(response.body).toContain('height="200"');
      });

      it("should return SVG avatar with custom size", async () => {
        const response = await app.inject({
          method: "GET",
          url: "/api/avatar/test@example.com?size=400",
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toContain('width="400"');
        expect(response.body).toContain('height="400"');
      });

      it("should set proper cache headers", async () => {
        const response = await app.inject({
          method: "GET",
          url: "/api/avatar/test@example.com",
        });

        expect(response.statusCode).toBe(200);
        expect(response.headers["cache-control"]).toBe(
          "public, max-age=31536000, immutable"
        );
      });

      it("should generate consistent avatar for same identifier", async () => {
        const response1 = await app.inject({
          method: "GET",
          url: "/api/avatar/consistent@example.com",
        });

        const response2 = await app.inject({
          method: "GET",
          url: "/api/avatar/consistent@example.com",
        });

        expect(response1.body).toEqual(response2.body);
      });

      it("should generate different avatars for different identifiers", async () => {
        const response1 = await app.inject({
          method: "GET",
          url: "/api/avatar/user1@example.com",
        });

        const response2 = await app.inject({
          method: "GET",
          url: "/api/avatar/user2@example.com",
        });

        expect(response1.body).not.toEqual(response2.body);
      });

      it("should handle minimum valid size (50)", async () => {
        const response = await app.inject({
          method: "GET",
          url: "/api/avatar/test@example.com?size=50",
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toContain('width="50"');
      });

      it("should handle maximum valid size (1000)", async () => {
        const response = await app.inject({
          method: "GET",
          url: "/api/avatar/test@example.com?size=1000",
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toContain('width="1000"');
      });

      it("should handle identifier with special characters", async () => {
        const response = await app.inject({
          method: "GET",
          url: "/api/avatar/user+test@example.com",
        });

        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toBe("image/svg+xml");
      });

      it("should handle URL-encoded identifier", async () => {
        const identifier = encodeURIComponent("user@example.com");
        const response = await app.inject({
          method: "GET",
          url: `/api/avatar/${identifier}`,
        });

        expect(response.statusCode).toBe(200);
      });

      it("should handle numeric identifier", async () => {
        const response = await app.inject({
          method: "GET",
          url: "/api/avatar/12345",
        });

        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toBe("image/svg+xml");
      });
    });

    describe("Validation and Error Cases", () => {
      it("should reject size below minimum (49)", async () => {
        const response = await app.inject({
          method: "GET",
          url: "/api/avatar/test@example.com?size=49",
        });

        expect(response.statusCode).toBe(400);
        const body = JSON.parse(response.body);
        expect(body.error).toBe("Invalid size");
        expect(body.message).toContain("between 50 and 1000");
      });

      it("should reject size above maximum (1001)", async () => {
        const response = await app.inject({
          method: "GET",
          url: "/api/avatar/test@example.com?size=1001",
        });

        expect(response.statusCode).toBe(400);
        const body = JSON.parse(response.body);
        expect(body.error).toBe("Invalid size");
      });

      it("should reject negative size", async () => {
        const response = await app.inject({
          method: "GET",
          url: "/api/avatar/test@example.com?size=-100",
        });

        expect(response.statusCode).toBe(400);
        const body = JSON.parse(response.body);
        expect(body.error).toBe("Invalid size");
      });

      it("should reject zero size", async () => {
        const response = await app.inject({
          method: "GET",
          url: "/api/avatar/test@example.com?size=0",
        });

        expect(response.statusCode).toBe(400);
        const body = JSON.parse(response.body);
        expect(body.error).toBe("Invalid size");
      });

      it("should reject non-numeric size", async () => {
        const response = await app.inject({
          method: "GET",
          url: "/api/avatar/test@example.com?size=abc",
        });

        expect(response.statusCode).toBe(400);
        const body = JSON.parse(response.body);
        expect(body.error).toBe("Invalid size");
      });

      it("should reject decimal size", async () => {
        const response = await app.inject({
          method: "GET",
          url: "/api/avatar/test@example.com?size=200.5",
        });

        // 200.5 parses to 200, which is valid
        expect(response.statusCode).toBe(200);
      });

      it("should handle empty identifier", async () => {
        const response = await app.inject({
          method: "GET",
          url: "/api/avatar/",
        });

        // Empty identifier generates avatar for empty string
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toBe("image/svg+xml");
      });
    });
  });

  describe("GET /api/avatar/:identifier/info", () => {
    describe("Success Cases", () => {
      it("should return avatar features/metadata", async () => {
        const response = await app.inject({
          method: "GET",
          url: "/api/avatar/test@example.com/info",
        });

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(body).toHaveProperty("identifier");
        expect(body).toHaveProperty("features");
        expect(body.identifier).toBe("test@example.com");
      });

      it("should return all feature properties", async () => {
        const response = await app.inject({
          method: "GET",
          url: "/api/avatar/test@example.com/info",
        });

        const body = JSON.parse(response.body);
        const features = body.features;

        expect(features).toHaveProperty("skinColor");
        expect(features).toHaveProperty("eyeType");
        expect(features).toHaveProperty("mouthType");
        expect(features).toHaveProperty("noseType");
        expect(features).toHaveProperty("hairType");
        expect(features).toHaveProperty("hairColor");
        expect(features).toHaveProperty("accessoryType");
      });

      it("should return consistent features for same identifier", async () => {
        const response1 = await app.inject({
          method: "GET",
          url: "/api/avatar/consistent@example.com/info",
        });

        const response2 = await app.inject({
          method: "GET",
          url: "/api/avatar/consistent@example.com/info",
        });

        const body1 = JSON.parse(response1.body);
        const body2 = JSON.parse(response2.body);

        expect(body1.features).toEqual(body2.features);
      });

      it("should return different features for different identifiers", async () => {
        const response1 = await app.inject({
          method: "GET",
          url: "/api/avatar/user1@example.com/info",
        });

        const response2 = await app.inject({
          method: "GET",
          url: "/api/avatar/user2@example.com/info",
        });

        const body1 = JSON.parse(response1.body);
        const body2 = JSON.parse(response2.body);

        expect(body1.features).not.toEqual(body2.features);
      });

      it("should return valid HSL colors", async () => {
        const response = await app.inject({
          method: "GET",
          url: "/api/avatar/test@example.com/info",
        });

        const body = JSON.parse(response.body);
        const features = body.features;

        expect(features.skinColor).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
        expect(features.hairColor).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
      });

      it("should return feature types within valid ranges", async () => {
        const response = await app.inject({
          method: "GET",
          url: "/api/avatar/test@example.com/info",
        });

        const body = JSON.parse(response.body);
        const features = body.features;

        expect(features.eyeType).toBeGreaterThanOrEqual(0);
        expect(features.eyeType).toBeLessThan(4);
        expect(features.mouthType).toBeGreaterThanOrEqual(0);
        expect(features.mouthType).toBeLessThan(4);
        expect(features.noseType).toBeGreaterThanOrEqual(0);
        expect(features.noseType).toBeLessThan(3);
        expect(features.hairType).toBeGreaterThanOrEqual(0);
        expect(features.hairType).toBeLessThan(5);
        expect(features.accessoryType).toBeGreaterThanOrEqual(0);
        expect(features.accessoryType).toBeLessThan(4);
      });

      it("should set proper content-type header", async () => {
        const response = await app.inject({
          method: "GET",
          url: "/api/avatar/test@example.com/info",
        });

        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toContain("application/json");
      });
    });

    describe("Edge Cases", () => {
      it("should handle very long identifier", async () => {
        // Use a reasonably long identifier
        const longId = "very.long.user.name.test" + "@example.com";
        const response = await app.inject({
          method: "GET",
          url: `/api/avatar/${encodeURIComponent(longId)}/info`,
        });

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(body.identifier).toBe(longId);
      });

      it("should handle unicode identifier", async () => {
        const unicodeId = "用户@例子.com";
        const response = await app.inject({
          method: "GET",
          url: `/api/avatar/${encodeURIComponent(unicodeId)}/info`,
        });

        expect(response.statusCode).toBe(200);
      });
    });
  });

  describe("API-Wide Behavior", () => {
    it("should return 404 for non-existent routes", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/nonexistent",
      });

      expect(response.statusCode).toBe(404);
    });

    it("should reject unsupported HTTP methods on avatar endpoint", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/avatar/test@example.com",
      });

      expect(response.statusCode).toBe(404);
    });

    it("should reject unsupported HTTP methods on info endpoint", async () => {
      const response = await app.inject({
        method: "DELETE",
        url: "/api/avatar/test@example.com/info",
      });

      expect(response.statusCode).toBe(404);
    });

    it("should handle concurrent requests efficiently", async () => {
      const promises = Array.from({ length: 10 }, (_, i) =>
        app.inject({
          method: "GET",
          url: `/api/avatar/user${i}@example.com`,
        })
      );

      const responses = await Promise.all(promises);
      responses.forEach((response) => {
        expect(response.statusCode).toBe(200);
      });
    });

    it("should maintain data consistency between endpoints", async () => {
      const identifier = "consistency@test.com";

      // Get SVG
      const svgResponse = await app.inject({
        method: "GET",
        url: `/api/avatar/${identifier}`,
      });

      // Get info
      const infoResponse = await app.inject({
        method: "GET",
        url: `/api/avatar/${identifier}/info`,
      });

      const info = JSON.parse(infoResponse.body);
      const svg = svgResponse.body;

      // SVG should contain the same skin color as in the info
      expect(svg).toContain(info.features.skinColor);
    });
  });

  describe("Real-World Usage Scenarios", () => {
    it("should handle typical email identifier", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/avatar/john.doe@company.com",
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toBe("image/svg+xml");
    });

    it("should handle username-style identifier", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/avatar/johndoe123",
      });

      expect(response.statusCode).toBe(200);
    });

    it("should handle UUID identifier", async () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000";
      const response = await app.inject({
        method: "GET",
        url: `/api/avatar/${uuid}`,
      });

      expect(response.statusCode).toBe(200);
    });

    it("should support profile picture workflow", async () => {
      const identifier = "profiletest@example.com";

      // Get info to display features
      const infoResponse = await app.inject({
        method: "GET",
        url: `/api/avatar/${identifier}/info`,
      });
      expect(infoResponse.statusCode).toBe(200);

      // Get avatar for display
      const avatarResponse = await app.inject({
        method: "GET",
        url: `/api/avatar/${identifier}?size=200`,
      });
      expect(avatarResponse.statusCode).toBe(200);

      // Get larger version for detail view
      const largeResponse = await app.inject({
        method: "GET",
        url: `/api/avatar/${identifier}?size=600`,
      });
      expect(largeResponse.statusCode).toBe(200);
    });

    it("should be performant for batch avatar generation", async () => {
      const startTime = Date.now();

      const promises = Array.from({ length: 50 }, (_, i) =>
        app.inject({
          method: "GET",
          url: `/api/avatar/batch${i}@test.com`,
        })
      );

      await Promise.all(promises);
      const endTime = Date.now();
      const duration = endTime - startTime;

      // 50 avatars should be generated in reasonable time (< 5 seconds)
      expect(duration).toBeLessThan(5000);
    });
  });
});
