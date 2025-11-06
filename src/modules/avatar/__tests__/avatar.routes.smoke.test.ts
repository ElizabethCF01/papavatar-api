import { describe, it, expect } from 'vitest';
import Fastify from 'fastify';
import avatarRoutes from '../avatar.controller.js';

describe('Avatar Routes - Smoke Test', () => {
  it('should be a function', () => {
    expect(typeof avatarRoutes).toBe('function');
  });

  it('should register routes without errors', async () => {
    const fastify = Fastify();
    await expect(
      fastify.register(avatarRoutes, { prefix: '/api' })
    ).resolves.not.toThrow();
    await fastify.close();
  });

  it('should register avatar endpoint', async () => {
    const fastify = Fastify();
    await fastify.register(avatarRoutes, { prefix: '/api' });

    const routes = fastify.printRoutes({ commonPrefix: false });
    expect(routes).toContain('/api/avatar/:identifier');

    await fastify.close();
  });

  it('should register avatar info endpoint', async () => {
    const fastify = Fastify();
    await fastify.register(avatarRoutes, { prefix: '/api' });

    const routes = fastify.printRoutes({ commonPrefix: false });
    expect(routes).toContain('/info');

    await fastify.close();
  });
});
