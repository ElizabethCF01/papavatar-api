import { describe, it, expect } from 'vitest';
import { AvatarGenerator, generateFaceSVG } from '../avatar.service.js';

describe('AvatarGenerator - Smoke Test', () => {
  it('should create an instance', () => {
    const generator = new AvatarGenerator('test');
    expect(generator).toBeInstanceOf(AvatarGenerator);
  });

  it('should generate SVG string', () => {
    const generator = new AvatarGenerator('test');
    const svg = generator.generateSVG();
    expect(svg).toBeDefined();
    expect(typeof svg).toBe('string');
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });

  it('should get features', () => {
    const generator = new AvatarGenerator('test');
    const features = generator.getFeatures();
    expect(features).toBeDefined();
    expect(features).toHaveProperty('skinColor');
    expect(features).toHaveProperty('hairColor');
  });

  it('should export generateFaceSVG function', () => {
    const svg = generateFaceSVG('test');
    expect(svg).toBeDefined();
    expect(typeof svg).toBe('string');
  });
});
