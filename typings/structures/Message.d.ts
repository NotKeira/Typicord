import type { Client } from "@/client/Client";
import type { Message as GatewayMessage } from "@/types/gateway/structures/Message";
/**
 * Represents a Discord message and provides helper methods for common actions.
 */
export declare class Message {
    id: string;
    channelId: string;
    channel_id: string;
    guildId?: string;
    content: string;
    author: GatewayMessage["author"];
    raw: GatewayMessage;
    timestamp: string;
    editedTimestamp: string | null;
    edited_timestamp: string | null;
    private client;
    constructor(client: Client, data: GatewayMessage);
    /**
     * Reply to this message.
     * @param content The reply content
     */
    reply(content: string): Promise<Message>;
    /**
     * Edit this message.
     * @param content The new content
     */
    edit(content: string): Promise<Message>;
    /**
     * Delete this message.
     */
    delete(): Promise<void>;
    /**
     * React to this message with an emoji.
     * @param emoji The emoji to react with
     */
    react(emoji: string): Promise<void>;
}
//# sourceMappingURL=Message.d.ts.map