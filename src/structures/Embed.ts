import type { Embed as RawEmbed } from "../types/structures/Embed";

export class Embed {
  private data: RawEmbed;

  constructor(data?: RawEmbed) {
    this.data = data ?? {};
  }

  setTitle(title: string): this {
    this.data.title = title;
    return this;
  }

  setDescription(description: string): this {
    this.data.description = description;
    return this;
  }

  setColor(color: number): this {
    this.data.color = color;
    return this;
  }

  setColour(colour: number): this {
    return this.setColor(colour);
  }

  setAuthor(name: string, url?: string) {
    this.data.author = { name, url };
    return this;
  }

  setFooter(text: string, iconUrl?: string) {
    this.data.footer = { text, icon_url: iconUrl };
    return this;
  }

  setImage(url: string) {
    this.data.image = { url };
    return this;
  }

  setThumbnail(url: string) {
    this.data.thumbnail = { url };
    return this;
  }

  addField(name: string, value: string, inline = false): this {
    if (!this.data.fields) this.data.fields = [];
    this.data.fields.push({ name, value, inline });
    return this;
  }

  toJSON(): RawEmbed {
    return this.data;
  }
}
