/**
 * USER_UPDATE Event
 *
 * Emitted when the bot user's information is updated.
 */
import type { User } from "@/types/structures/user";
export declare class UserUpdateData {
    data: User;
    constructor(data: User);
    /**
     * The updated user data
     */
    get user(): User;
    /**
     * User ID
     */
    get id(): string;
    /**
     * Username
     */
    get username(): string;
    /**
     * Discriminator
     */
    get discriminator(): string;
    /**
     * Avatar hash
     */
    get avatar(): string | null | undefined;
    /**
     * Whether the user is a bot
     */
    get bot(): boolean | undefined;
    /**
     * User flags
     */
    get flags(): number | undefined;
    /**
     * Premium type
     */
    get premiumType(): number | undefined;
}
//# sourceMappingURL=USER_UPDATE.d.ts.map