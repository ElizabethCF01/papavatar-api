import { describe, it, expect } from 'vitest';
import { config } from './config.js';

describe('Config - Smoke Test', () => {
  it('should export config object', () => {
    expect(config).toBeDefined();
  });

  it('should have required properties', () => {
    expect(config).toHaveProperty('port');
    expect(config).toHaveProperty('host');
    expect(config).toHaveProperty('logLevel');
    expect(config).toHaveProperty('nodeEnv');
  });

  it('should have valid port number', () => {
    expect(typeof config.port).toBe('number');
    expect(config.port).toBeGreaterThan(0);
    expect(config.port).toBeLessThanOrEqual(65535);
  });

  it('should have valid host string', () => {
    expect(typeof config.host).toBe('string');
    expect(config.host.length).toBeGreaterThan(0);
  });
});
