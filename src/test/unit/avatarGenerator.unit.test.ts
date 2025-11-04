import { describe, it, expect, beforeEach } from 'vitest';
import { AvatarGenerator, generateFaceSVG } from '../../services/avatarGenerator.js';

describe('AvatarGenerator - Comprehensive Unit Tests', () => {
  describe('Constructor and Initialization', () => {
    it('should create instance with valid identifier', () => {
      const generator = new AvatarGenerator('test@example.com');
      expect(generator).toBeInstanceOf(AvatarGenerator);
    });

    it('should handle empty string identifier', () => {
      const generator = new AvatarGenerator('');
      expect(generator).toBeInstanceOf(AvatarGenerator);
      expect(generator.getFeatures()).toBeDefined();
    });

    it('should handle special characters in identifier', () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const generator = new AvatarGenerator(specialChars);
      expect(generator).toBeInstanceOf(AvatarGenerator);
    });

    it('should handle unicode characters in identifier', () => {
      const generator = new AvatarGenerator('用户@例子.com');
      expect(generator).toBeInstanceOf(AvatarGenerator);
    });

    it('should generate consistent features for same identifier', () => {
      const gen1 = new AvatarGenerator('user@example.com');
      const gen2 = new AvatarGenerator('user@example.com');
      expect(gen1.getFeatures()).toEqual(gen2.getFeatures());
    });

    it('should generate different features for different identifiers', () => {
      const gen1 = new AvatarGenerator('user1@example.com');
      const gen2 = new AvatarGenerator('user2@example.com');
      expect(gen1.getFeatures()).not.toEqual(gen2.getFeatures());
    });
  });

  describe('Feature Extraction', () => {
    let generator: AvatarGenerator;

    beforeEach(() => {
      generator = new AvatarGenerator('test@example.com');
    });

    it('should extract all required features', () => {
      const features = generator.getFeatures();
      expect(features).toHaveProperty('skinColor');
      expect(features).toHaveProperty('eyeType');
      expect(features).toHaveProperty('mouthType');
      expect(features).toHaveProperty('noseType');
      expect(features).toHaveProperty('hairType');
      expect(features).toHaveProperty('hairColor');
      expect(features).toHaveProperty('accessoryType');
    });

    it('should generate valid HSL color for skin', () => {
      const features = generator.getFeatures();
      expect(features.skinColor).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
    });

    it('should generate valid HSL color for hair', () => {
      const features = generator.getFeatures();
      expect(features.hairColor).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
    });

    it('should generate eyeType within valid range (0-3)', () => {
      const features = generator.getFeatures();
      expect(features.eyeType).toBeGreaterThanOrEqual(0);
      expect(features.eyeType).toBeLessThan(4);
      expect(Number.isInteger(features.eyeType)).toBe(true);
    });

    it('should generate mouthType within valid range (0-3)', () => {
      const features = generator.getFeatures();
      expect(features.mouthType).toBeGreaterThanOrEqual(0);
      expect(features.mouthType).toBeLessThan(4);
      expect(Number.isInteger(features.mouthType)).toBe(true);
    });

    it('should generate noseType within valid range (0-2)', () => {
      const features = generator.getFeatures();
      expect(features.noseType).toBeGreaterThanOrEqual(0);
      expect(features.noseType).toBeLessThan(3);
      expect(Number.isInteger(features.noseType)).toBe(true);
    });

    it('should generate hairType within valid range (0-4)', () => {
      const features = generator.getFeatures();
      expect(features.hairType).toBeGreaterThanOrEqual(0);
      expect(features.hairType).toBeLessThan(5);
      expect(Number.isInteger(features.hairType)).toBe(true);
    });

    it('should generate accessoryType within valid range (0-3)', () => {
      const features = generator.getFeatures();
      expect(features.accessoryType).toBeGreaterThanOrEqual(0);
      expect(features.accessoryType).toBeLessThan(4);
      expect(Number.isInteger(features.accessoryType)).toBe(true);
    });

    it('should return a copy of features, not the original', () => {
      const features1 = generator.getFeatures();
      const features2 = generator.getFeatures();
      expect(features1).toEqual(features2);
      expect(features1).not.toBe(features2);
    });
  });

  describe('SVG Generation', () => {
    let generator: AvatarGenerator;

    beforeEach(() => {
      generator = new AvatarGenerator('test@example.com');
    });

    it('should generate valid SVG with default size', () => {
      const svg = generator.generateSVG();
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain('width="200"');
      expect(svg).toContain('height="200"');
    });

    it('should generate SVG with custom size', () => {
      const svg = generator.generateSVG(400);
      expect(svg).toContain('width="400"');
      expect(svg).toContain('height="400"');
    });

    it('should include viewBox attribute', () => {
      const svg = generator.generateSVG();
      expect(svg).toContain('viewBox="0 0 200 200"');
    });

    it('should include xmlns attribute', () => {
      const svg = generator.generateSVG();
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    });

    it('should include background rectangle', () => {
      const svg = generator.generateSVG();
      expect(svg).toContain('<rect width="200" height="200" fill="#f0f0f0"/>');
    });

    it('should include face circle with skin color', () => {
      const svg = generator.generateSVG();
      const features = generator.getFeatures();
      expect(svg).toContain(`fill="${features.skinColor}"`);
      expect(svg).toContain('cx="100" cy="100" r="80"');
    });

    it('should generate different SVGs for different identifiers', () => {
      const gen1 = new AvatarGenerator('user1@example.com');
      const gen2 = new AvatarGenerator('user2@example.com');
      const svg1 = gen1.generateSVG();
      const svg2 = gen2.generateSVG();
      expect(svg1).not.toEqual(svg2);
    });

    it('should generate consistent SVG for same identifier', () => {
      const gen1 = new AvatarGenerator('user@example.com');
      const gen2 = new AvatarGenerator('user@example.com');
      const svg1 = gen1.generateSVG();
      const svg2 = gen2.generateSVG();
      expect(svg1).toEqual(svg2);
    });

    it('should handle very small size', () => {
      const svg = generator.generateSVG(50);
      expect(svg).toContain('width="50"');
      expect(svg).toContain('height="50"');
    });

    it('should handle very large size', () => {
      const svg = generator.generateSVG(1000);
      expect(svg).toContain('width="1000"');
      expect(svg).toContain('height="1000"');
    });
  });

  describe('Feature Variations Coverage', () => {
    it('should cover all eye types across different identifiers', () => {
      const eyeTypes = new Set<number>();
      for (let i = 0; i < 100; i++) {
        const gen = new AvatarGenerator(`user${i}@example.com`);
        eyeTypes.add(gen.getFeatures().eyeType);
      }
      // Should have at least 3 different eye types in 100 iterations
      expect(eyeTypes.size).toBeGreaterThanOrEqual(3);
    });

    it('should cover all mouth types across different identifiers', () => {
      const mouthTypes = new Set<number>();
      for (let i = 0; i < 100; i++) {
        const gen = new AvatarGenerator(`mouth${i}@test.com`);
        mouthTypes.add(gen.getFeatures().mouthType);
      }
      expect(mouthTypes.size).toBeGreaterThanOrEqual(3);
    });

    it('should cover all nose types across different identifiers', () => {
      const noseTypes = new Set<number>();
      for (let i = 0; i < 100; i++) {
        const gen = new AvatarGenerator(`nose${i}@test.com`);
        noseTypes.add(gen.getFeatures().noseType);
      }
      expect(noseTypes.size).toBeGreaterThanOrEqual(2);
    });

    it('should generate varied skin colors', () => {
      const skinColors = new Set<string>();
      for (let i = 0; i < 50; i++) {
        const gen = new AvatarGenerator(`skin${i}@test.com`);
        skinColors.add(gen.getFeatures().skinColor);
      }
      // Should have many different colors
      expect(skinColors.size).toBeGreaterThan(40);
    });
  });

  describe('Exported generateFaceSVG Function', () => {
    it('should generate SVG with default size', () => {
      const svg = generateFaceSVG('test@example.com');
      expect(svg).toContain('<svg');
      expect(svg).toContain('width="200"');
    });

    it('should generate SVG with custom size', () => {
      const svg = generateFaceSVG('test@example.com', 300);
      expect(svg).toContain('width="300"');
    });

    it('should produce same result as class method', () => {
      const identifier = 'test@example.com';
      const gen = new AvatarGenerator(identifier);
      const svg1 = gen.generateSVG(200);
      const svg2 = generateFaceSVG(identifier, 200);
      expect(svg1).toEqual(svg2);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle very long identifier', () => {
      const longId = 'a'.repeat(10000);
      const generator = new AvatarGenerator(longId);
      expect(generator.generateSVG()).toContain('<svg');
    });

    it('should handle numeric identifier', () => {
      const generator = new AvatarGenerator('12345');
      expect(generator.generateSVG()).toContain('<svg');
    });

    it('should handle identifier with newlines', () => {
      const generator = new AvatarGenerator('test\n@example.com');
      expect(generator.generateSVG()).toContain('<svg');
    });

    it('should produce valid SVG structure', () => {
      const svg = new AvatarGenerator('test').generateSVG();
      const openTags = (svg.match(/<svg/g) || []).length;
      const closeTags = (svg.match(/<\/svg>/g) || []).length;
      expect(openTags).toBe(closeTags);
    });
  });

  describe('Deterministic Behavior', () => {
    it('should generate same hash for same input multiple times', () => {
      const id = 'deterministic@test.com';
      const features1 = new AvatarGenerator(id).getFeatures();
      const features2 = new AvatarGenerator(id).getFeatures();
      const features3 = new AvatarGenerator(id).getFeatures();

      expect(features1).toEqual(features2);
      expect(features2).toEqual(features3);
    });

    it('should be case-sensitive', () => {
      const gen1 = new AvatarGenerator('Test@Example.com');
      const gen2 = new AvatarGenerator('test@example.com');
      expect(gen1.getFeatures()).not.toEqual(gen2.getFeatures());
    });
  });
});
