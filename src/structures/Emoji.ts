/**
 * Represents a Discord emoji and provides helper methods.
 */
import type { Emoji as RawEmoji } from "../types/structures/Emoji";

export class Emoji {
  /**
   * Create a new Emoji instance.
   * @param data The raw emoji data
   */
  constructor(public data: RawEmoji) {}

  /**
   * Convert the emoji to a Discord mention string.
   */
  toString(): string {
    if (!this.data.id || !this.data.name) return "";
    return this.data.animated
      ? `<a:${this.data.name}:${this.data.id}>`
      : `<:${this.data.name}:${this.data.id}>`;
  }

  /**
   * Check if the emoji is a custom emoji.
   */
  isCustom(): boolean {
    return this.data.id !== null;
  }

  /**
   * Check if the emoji is animated.
   */
  isAnimated(): boolean {
    return this.data.animated === true;
  }
}
