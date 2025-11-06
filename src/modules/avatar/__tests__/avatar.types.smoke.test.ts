import { describe, it, expect } from 'vitest';
import type { AvatarOptions, AvatarFeatures } from '../avatar.types.js';

describe('Types - Smoke Test', () => {
  it('should allow valid AvatarOptions', () => {
    const options: AvatarOptions = { size: 200 };
    expect(options.size).toBe(200);
  });

  it('should allow AvatarOptions without size', () => {
    const options: AvatarOptions = {};
    expect(options).toBeDefined();
  });

  it('should allow valid AvatarFeatures', () => {
    const features: AvatarFeatures = {
      skinColor: 'hsl(0, 50%, 70%)',
      eyeType: 0,
      mouthType: 0,
      noseType: 0,
      hairType: 0,
      hairColor: 'hsl(30, 60%, 50%)',
      accessoryType: 0,
    };
    expect(features.skinColor).toBeDefined();
    expect(features.eyeType).toBeGreaterThanOrEqual(0);
  });
});
