/**
 * Represents a Discord embed object and provides builder methods.
 */
import type { Embed as RawEmbed } from "../types/structures/Embed";
export declare class Embed {
    private data;
    /**
     * Create a new Embed instance.
     * @param data Optional initial embed data
     */
    constructor(data?: RawEmbed);
    /**
     * Set the embed title.
     */
    setTitle(title: string): this;
    /**
     * Set the embed description.
     */
    setDescription(description: string): this;
    /**
     * Set the embed color.
     */
    setColor(color: number): this;
    /**
     * Alias for setColor.
     */
    setColour(colour: number): this;
    /**
     * Set the embed author.
     */
    setAuthor(name: string, url?: string): this;
    /**
     * Set the embed footer.
     */
    setFooter(text: string, iconUrl?: string): this;
    /**
     * Set the embed image.
     */
    setImage(url: string): this;
    /**
     * Set the embed thumbnail.
     */
    setThumbnail(url: string): this;
    /**
     * Add a field to the embed.
     */
    addField(name: string, value: string, inline?: boolean): this;
    /**
     * Convert the embed to a raw JSON object.
     */
    toJSON(): RawEmbed;
}
//# sourceMappingURL=Embed.d.ts.map