import crypto from "crypto";
import type { AvatarFeatures } from "./avatar.types.js";

function hashToNumber(hash: string, start: number, length: number): number {
  const slice = hash.slice(start, start + length);
  return parseInt(slice, 16) / Math.pow(16, length);
}

export class AvatarGenerator {
  private hash: string;
  private features: AvatarFeatures;

  constructor(identifier: string) {
    this.hash = crypto.createHash("sha256").update(identifier).digest("hex");
    this.features = this.extractFeatures();
  }

  private extractFeatures(): AvatarFeatures {
    const skinHue = Math.floor(hashToNumber(this.hash, 0, 4) * 360);
    const hairHue = Math.floor(hashToNumber(this.hash, 8, 4) * 360);

    return {
      skinColor: `hsl(${skinHue}, 50%, 70%)`,
      eyeType: Math.floor(hashToNumber(this.hash, 4, 2) * 4),
      mouthType: Math.floor(hashToNumber(this.hash, 6, 2) * 4),
      noseType: Math.floor(hashToNumber(this.hash, 12, 2) * 3),
      hairType: Math.floor(hashToNumber(this.hash, 14, 2) * 5),
      hairColor: `hsl(${hairHue}, 60%, 50%)`,
      accessoryType: Math.floor(hashToNumber(this.hash, 16, 2) * 4),
    };
  }

  private getEyes(): string {
    const eyes = [
      // Round eyes
      `<circle cx="70" cy="80" r="8" fill="black" />
       <circle cx="130" cy="80" r="8" fill="black" />`,
      // Rectangular eyes
      `<rect x="62" y="75" width="16" height="6" fill="black"/>
       <rect x="122" y="75" width="16" height="6" fill="black"/>`,
      // Blue eyes
      `<circle cx="70" cy="80" r="8" fill="#4A90E2"/>
       <circle cx="70" cy="80" r="4" fill="black"/>
       <circle cx="130" cy="80" r="8" fill="#4A90E2"/>
       <circle cx="130" cy="80" r="4" fill="black"/>`,
      // Winking
      `<circle cx="70" cy="80" r="8" fill="black" />
       <line x1="122" y1="80" x2="138" y2="80" stroke="black" stroke-width="4"/>`,
    ];
    return eyes[this.features.eyeType];
  }

  private getMouth(): string {
    const mouths = [
      // Happy smile
      `<path d="M70 130 Q100 150, 130 130" stroke="black" stroke-width="4" fill="none"/>`,
      // Straight line
      `<line x1="70" y1="130" x2="130" y2="130" stroke="black" stroke-width="4"/>`,
      // Sad mouth
      `<path d="M70 140 Q100 120, 130 140" stroke="black" stroke-width="4" fill="none"/>`,
      // Big smile with teeth
      `<path d="M70 130 Q100 150, 130 130" stroke="black" stroke-width="3" fill="white"/>
       <path d="M70 130 Q100 150, 130 130" stroke="black" stroke-width="2" fill="none"/>
       <line x1="85" y1="138" x2="85" y2="130" stroke="black" stroke-width="1.5"/>
       <line x1="93" y1="140" x2="93" y2="130" stroke="black" stroke-width="1.5"/>
       <line x1="100" y1="140" x2="100" y2="130" stroke="black" stroke-width="1.5"/>
       <line x1="107" y1="140" x2="107" y2="130" stroke="black" stroke-width="1.5"/>
       <line x1="115" y1="138" x2="115" y2="130" stroke="black" stroke-width="1.5"/>`,
    ];
    return mouths[this.features.mouthType];
  }

  private getNose(): string {
    const noses = [
      // Small dot
      `<circle cx="100" cy="105" r="3" fill="black"/>`,
      // Triangle
      `<path d="M100 100 L95 110 L105 110 Z" fill="#8B4513" />`,
      // Line
      `<line x1="100" y1="100" x2="100" y2="110" stroke="black" stroke-width="3" stroke-linecap="round"/>`,
    ];
    return noses[this.features.noseType];
  }

  private getHairBack(): string {
    const hairColor = this.features.hairColor;
    const hairBacks = [
      // Short hair - no back layer
      ``,
      // Curly hair
      `<circle cx="60" cy="40" r="25" fill="${hairColor}"/>
       <circle cx="100" cy="30" r="30" fill="${hairColor}"/>
       <circle cx="140" cy="40" r="25" fill="${hairColor}"/>`,
      // Spiky hair - back layer (base of head coverage)
      `<path d="M40 70 Q50 30, 100 25 Q150 30, 160 70" fill="${hairColor}"/>`,
      // Long hair - back layer
      `<ellipse cx="100" cy="60" rx="70" ry="50" fill="${hairColor}"/>
       <path d="M30 60 Q30 120, 40 160 L60 165 Q55 100, 60 60" fill="${hairColor}"/>
       <path d="M170 60 Q170 120, 160 160 L140 165 Q145 100, 140 60" fill="${hairColor}"/>`,
      // Bald/No hair
      ``,
    ];
    return hairBacks[this.features.hairType];
  }

  private getHairFront(): string {
    const hairColor = this.features.hairColor;
    const hairFronts = [
      // Short hair
      `<path d="M55 36 Q55 45, 65 65 M70 30 Q70 40, 80 62 M85 24 Q95 40, 100 62 M100 22 Q110 30, 115 62 M115 24 Q130 40, 135 65 M135 28 Q155 45, 155 65"
             fill="none" stroke="${hairColor}" stroke-width="10" stroke-linecap="round"/>`,
      // Curly hair - no front layer
      ``,
      // Spiky hair - front spikes
      `<path d="M55 65 L60 30 M75 65 L80 25 M95 65 L100 20 M115 65 L120 25 M135 65 L140 30"
             fill="none" stroke="${hairColor}" stroke-width="6" stroke-linecap="round"/>`,
      // Long hair - front bangs
      `<path d="M60 38 Q70 55, 75 60" fill="none" stroke="${hairColor}" stroke-width="12" stroke-linecap="round"/>
       <path d="M90 30 Q95 50, 100 60" fill="none" stroke="${hairColor}" stroke-width="12" stroke-linecap="round"/>
       <path d="M125 36 Q120 55, 115 60" fill="none" stroke="${hairColor}" stroke-width="12" stroke-linecap="round"/>`,
      // Bald/No hair
      ``,
    ];
    return hairFronts[this.features.hairType];
  }

  private getAccessory(): string {
    const accessories = [
      // No accessory
      ``,
      // Glasses
      `<circle cx="70" cy="80" r="15" fill="none" stroke="black" stroke-width="3"/>
       <circle cx="130" cy="80" r="15" fill="none" stroke="black" stroke-width="3"/>
       <line x1="85" y1="80" x2="115" y2="80" stroke="black" stroke-width="3"/>`,
      // Hat
      `<rect x="50" y="15" width="100" height="10" fill="#FF6B6B"/>
       <rect x="70" y="10" width="60" height="5" fill="#FF6B6B"/>`,
      // Earrings
      `<circle cx="40" cy="95" r="5" fill="gold"/>
       <circle cx="160" cy="95" r="5" fill="gold"/>`,
    ];
    return accessories[this.features.accessoryType];
  }

  public generateSVG(size: number = 200): string {
    return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#f0f0f0"/>
  ${this.getHairBack()}
  <circle cx="100" cy="100" r="80" fill="${this.features.skinColor}" />
  ${this.getEyes()}
  ${this.getNose()}
  ${this.getMouth()}
  ${this.getAccessory()}
  ${this.getHairFront()}
</svg>`;
  }

  public getFeatures(): AvatarFeatures {
    return { ...this.features };
  }
}

export function generateFaceSVG(
  identifier: string,
  size: number = 200
): string {
  const generator = new AvatarGenerator(identifier);
  return generator.generateSVG(size);
}
