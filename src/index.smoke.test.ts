import { describe, it, expect } from 'vitest';
import { config } from './config/config.js';

describe('Index Module - Smoke Test', () => {
  it('should have valid configuration for server startup', () => {
    expect(config.port).toBeDefined();
    expect(config.host).toBeDefined();
    expect(config.logLevel).toBeDefined();
  });

  it('should have numeric port', () => {
    expect(typeof config.port).toBe('number');
  });

  it('should have string host', () => {
    expect(typeof config.host).toBe('string');
  });

  it('should have valid log level', () => {
    const validLogLevels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'];
    expect(validLogLevels).toContain(config.logLevel);
  });
});
