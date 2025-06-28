/**
 * Represents a Discord embed object and provides builder methods.
 */
import type { Embed as RawEmbed } from "../types/structures/Embed";

export class Embed {
  private data: RawEmbed;

  /**
   * Create a new Embed instance.
   * @param data Optional initial embed data
   */
  constructor(data?: RawEmbed) {
    this.data = data ?? {};
  }

  /**
   * Set the embed title.
   */
  setTitle(title: string): this {
    this.data.title = title;
    return this;
  }

  /**
   * Set the embed description.
   */
  setDescription(description: string): this {
    this.data.description = description;
    return this;
  }

  /**
   * Set the embed color.
   */
  setColor(color: number): this {
    this.data.color = color;
    return this;
  }

  /**
   * Alias for setColor.
   */
  setColour(colour: number): this {
    return this.setColor(colour);
  }

  /**
   * Set the embed author.
   */
  setAuthor(name: string, url?: string) {
    this.data.author = { name, url };
    return this;
  }

  /**
   * Set the embed footer.
   */
  setFooter(text: string, iconUrl?: string) {
    this.data.footer = { text, icon_url: iconUrl };
    return this;
  }

  /**
   * Set the embed image.
   */
  setImage(url: string) {
    this.data.image = { url };
    return this;
  }

  /**
   * Set the embed thumbnail.
   */
  setThumbnail(url: string) {
    this.data.thumbnail = { url };
    return this;
  }

  /**
   * Add a field to the embed.
   */
  addField(name: string, value: string, inline = false): this {
    if (!this.data.fields) this.data.fields = [];
    this.data.fields.push({ name, value, inline });
    return this;
  }

  /**
   * Convert the embed to a raw JSON object.
   */
  toJSON(): RawEmbed {
    return this.data;
  }
}
