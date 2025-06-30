/**
 * Builder for Discord embeds - those fancy message boxes with colours and fields
 * Much nicer than plain text messages when you want to show structured info
 */
import type { Embed as RawEmbed } from "../types/structures/Embed";

export class Embed {
  private data: RawEmbed;

  /**
   * Creates a new embed builder
   * @param data Existing embed data if you want to start with something
   */
  constructor(data?: RawEmbed) {
    this.data = data ?? {};
  }

  /**
   * Sets the main title of the embed
   */
  setTitle(title: string): this {
    this.data.title = title;
    return this;
  }

  /**
   * Sets the description text (the main body content)
   */
  setDescription(description: string): this {
    this.data.description = description;
    return this;
  }

  /**
   * Sets the colour of the embed (left border)
   */
  setColor(color: number): this {
    this.data.color = color;
    return this;
  }

  /**
   * British spelling because I'm British and this is my library :)
   */
  setColour(colour: number): this {
    return this.setColor(colour);
  }

  /**
   * Sets the author section (small text + icon at the top)
   */
  setAuthor(name: string, url?: string) {
    this.data.author = { name, url };
    return this;
  }

  /**
   * Sets the footer text (bottom of the embed)
   */
  setFooter(text: string, iconUrl?: string) {
    this.data.footer = { text, icon_url: iconUrl };
    return this;
  }

  /**
   * Sets a large image in the embed
   */
  setImage(url: string) {
    this.data.image = { url };
    return this;
  }

  /**
   * Sets a small thumbnail image (top right usually)
   */
  setThumbnail(url: string) {
    this.data.thumbnail = { url };
    return this;
  }

  /**
   * Adds a field to the embed (name: value pairs)
   */
  addField(name: string, value: string, inline = false): this {
    if (!this.data.fields) this.data.fields = [];
    this.data.fields.push({ name, value, inline });
    return this;
  }

  /**
   * Converts this embed to raw JSON for sending to Discord
   */
  toJSON(): RawEmbed {
    return this.data;
  }
}
