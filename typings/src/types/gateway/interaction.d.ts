/**
 * Gateway-specific interaction data types
 */
import type { User } from "../structures/user";
import type { GuildMember } from "../structures/guild";
import type { Message } from "../structures/message";
/**
 * Raw interaction data received from Discord Gateway
 */
export interface RawInteractionData {
    /** ID of the interaction */
    id: string;
    /** ID of the application this interaction is for */
    application_id: string;
    /** Type of interaction */
    type: number;
    /** Interaction data payload */
    data?: {
        /** ID of the invoked command */
        id?: string;
        /** Name of the invoked command */
        name?: string;
        /** Type of the invoked command */
        type?: number;
        /** The custom_id of the component */
        custom_id?: string;
        /** Type of the component */
        component_type?: number;
        /** Values the user selected in a select menu component */
        values?: string[];
        /** Parameters + values from the user */
        options?: Array<{
            name: string;
            type: number;
            value?: string | number | boolean;
            options?: Array<{
                name: string;
                type: number;
                value?: string | number | boolean;
            }>;
            focused?: boolean;
        }>;
        /** For guild commands, the id of the guild the command is registered to */
        guild_id?: string;
        /** ID of the user or message targeted by a user or message command */
        target_id?: string;
        /** Resolved entities from selected options */
        resolved?: {
            users?: Record<string, User>;
            members?: Record<string, GuildMember>;
            roles?: Record<string, any>;
            channels?: Record<string, any>;
            messages?: Record<string, any>;
            attachments?: Record<string, any>;
        };
        /** Values submitted by the user (for modals) */
        components?: Array<{
            type: number;
            components: Array<{
                type: number;
                custom_id: string;
                value: string;
            }>;
        }>;
    };
    /** Guild that the interaction was sent from */
    guild_id?: string;
    /** Channel that the interaction was sent from */
    channel_id?: string;
    /** Guild member data for the invoking user, including permissions */
    member?: GuildMember;
    /** User object for the invoking user, if invoked in a DM */
    user?: User;
    /** Continuation token for responding to the interaction */
    token: string;
    /** Read-only property, always 1 */
    version: number;
    /** For components, the message they were attached to */
    message?: Message;
    /** Bitwise set of permissions the app or bot has within the channel the interaction was sent from */
    app_permissions?: string;
    /** Selected language of the invoking user */
    locale?: string;
    /** Guild's preferred locale, if invoked in a guild */
    guild_locale?: string;
}
//# sourceMappingURL=interaction.d.ts.map