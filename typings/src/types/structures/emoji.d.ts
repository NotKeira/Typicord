/**
 * Discord emoji type definitions
 */
import type { User } from "./user";
import type { Role } from "./role";
/**
 * Emoji object
 */
export interface Emoji {
    /** Emoji id (null if unicode emoji) */
    id: string | null;
    /** Emoji name (null only in reaction emoji objects) */
    name: string | null;
    /** Roles allowed to use this emoji */
    roles?: Role[];
    /** User that created this emoji */
    user?: User;
    /** Whether this emoji must be wrapped in colons */
    require_colons?: boolean;
    /** Whether this emoji is managed */
    managed?: boolean;
    /** Whether this emoji is animated */
    animated?: boolean;
    /** Whether this emoji can be used, may be false due to loss of server boosts */
    available?: boolean;
}
/**
 * Partial emoji object
 */
export interface PartialEmoji {
    /** Emoji id (null if unicode emoji) */
    id: string | null;
    /** Emoji name (null only in reaction emoji objects) */
    name: string | null;
    /** Whether this emoji is animated */
    animated?: boolean;
}
//# sourceMappingURL=emoji.d.ts.map