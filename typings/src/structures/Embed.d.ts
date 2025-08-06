/**
 * Builder for Discord embeds - those fancy message boxes with colours and fields
 * Much nicer than plain text messages when you want to show structured info
 */
import type { Embed as RawEmbed } from "../types/structures/Embed";
export declare class Embed {
    private readonly data;
    /**
     * Creates a new embed builder
     * @param data Existing embed data if you want to start with something
     */
    constructor(data?: RawEmbed);
    /**
     * Sets the main title of the embed
     */
    setTitle(title: string): this;
    /**
     * Sets the description text (the main body content)
     */
    setDescription(description: string): this;
    /**
     * Sets the colour of the embed (left border)
     */
    setColor(color: number): this;
    /**
     * British spelling because I'm British and this is my library :)
     */
    setColour(colour: number): this;
    /**
     * Sets the author section (small text + icon at the top)
     */
    setAuthor(name: string, url?: string): this;
    /**
     * Sets the footer text (bottom of the embed)
     */
    setFooter(text: string, iconUrl?: string): this;
    /**
     * Sets a large image in the embed
     */
    setImage(url: string): this;
    /**
     * Sets a small thumbnail image (top right usually)
     */
    setThumbnail(url: string): this;
    /**
     * Adds a field to the embed (name: value pairs)
     */
    addField(name: string, value: string, inline?: boolean): this;
    /**
     * Converts this embed to raw JSON for sending to Discord
     */
    toJSON(): RawEmbed;
}
//# sourceMappingURL=Embed.d.ts.map