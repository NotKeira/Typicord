import type { Emoji as RawEmoji } from "../types/structures/Emoji";

export class Emoji {
  constructor(public data: RawEmoji) {}

  toString(): string {
    if (!this.data.id || !this.data.name) return "";
    return this.data.animated
      ? `<a:${this.data.name}:${this.data.id}>`
      : `<:${this.data.name}:${this.data.id}>`;
  }

  isCustom(): boolean {
    return this.data.id !== null;
  }

  isAnimated(): boolean {
    return this.data.animated === true;
  }
}
