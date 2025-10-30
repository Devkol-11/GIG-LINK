import { createAvatar } from "@dicebear/core";
import { dylan } from "@dicebear/collection";
import { IAvatarGenerator } from "../domain/interfaces/IAvatarGenerator.js";

export class AvatarGenerator implements IAvatarGenerator {
  private seed: string;
  constructor() {
    this.seed = Math.random().toString(36).substring(2, 10);
  }

  generateAvatar(seed: string = this.seed): string {
    const avatar = createAvatar(dylan, {
      seed,
      backgroundColor: ["b6e3f4", "c0aede", "d1d4f9"],
      backgroundType: ["gradientLinear", "solid"],
      facialHairProbability: 50,
      hair: ["bangs", "buns", "flatTop", "buns", "shortCurls"],
      hairColor: ["000000", "1d5dff", "ff543d"],
      mood: ["happy", "hopeful", "neutral"],
    });

    return avatar.toString();
  }
}

export const avatarGenerator = new AvatarGenerator();
