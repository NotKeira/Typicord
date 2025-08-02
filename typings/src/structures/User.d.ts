import type { User as RawUser } from "../types/structures/User";
export declare class User {
    data: RawUser;
    constructor(data: RawUser);
    get name(): string;
    get discriminator(): string;
    get id(): string;
    get tag(): string;
    get mention(): string;
    get isSystem(): boolean;
    get isVerified(): boolean;
    get isMFAEnabled(): boolean;
    get isBot(): boolean;
    get avatarURL(): string | null;
}
//# sourceMappingURL=User.d.ts.map