/**
 * Represents a Discord emoji and provides helper methods.
 */
import type { Emoji as RawEmoji } from "../types/structures/Emoji";
export declare class Emoji {
    data: RawEmoji;
    /**
     * Create a new Emoji instance.
     * @param data The raw emoji data
     */
    constructor(data: RawEmoji);
    /**
     * Convert the emoji to a Discord mention string.
     */
    toString(): string;
    /**
     * Check if the emoji is a custom emoji.
     */
    isCustom(): boolean;
    /**
     * Check if the emoji is animated.
     */
    isAnimated(): boolean;
}
//# sourceMappingURL=Emoji.d.ts.map