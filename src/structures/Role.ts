import type { Client } from "@/client/Client";

/**
 * Discord role structure data from the API
 */
export interface RoleData {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  icon?: string | null;
  unicode_emoji?: string | null;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
  tags?: {
    bot_id?: string;
    integration_id?: string;
    premium_subscriber?: null;
    subscription_listing_id?: string;
    available_for_purchase?: null;
    guild_connections?: null;
  };
}

/**
 * Represents a Discord role with methods for management
 */
export class Role {
  public readonly id: string;
  public name: string;
  public color: number;
  public hoist: boolean;
  public icon?: string | null;
  public unicodeEmoji?: string | null;
  public position: number;
  public permissions: string;
  public managed: boolean;
  public mentionable: boolean;
  public tags?: RoleData["tags"];
  public guildId: string;
  public raw: RoleData;
  private readonly client: Client;

  constructor(client: Client, data: RoleData, guildId: string) {
    this.client = client;
    this.guildId = guildId;
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.hoist = data.hoist;
    this.icon = data.icon;
    this.unicodeEmoji = data.unicode_emoji;
    this.position = data.position;
    this.permissions = data.permissions;
    this.managed = data.managed;
    this.mentionable = data.mentionable;
    this.tags = data.tags;
    this.raw = data;
  }

  /**
   * Edits this role
   */
  public async edit(
    options: {
      name?: string;
      permissions?: string;
      color?: number;
      hoist?: boolean;
      icon?: string | null;
      unicode_emoji?: string | null;
      mentionable?: boolean;
    },
    reason?: string
  ): Promise<Role> {
    const headers: Record<string, string> = {};
    if (reason) headers["X-Audit-Log-Reason"] = reason;

    const data = await this.client.rest.patch(
      `/guilds/${this.guildId}/roles/${this.id}`,
      options,
      headers
    );
    return new Role(this.client, data as any, this.guildId);
  }

  /**
   * Deletes this role
   */
  public async delete(reason?: string): Promise<void> {
    const headers: Record<string, string> = {};
    if (reason) headers["X-Audit-Log-Reason"] = reason;

    await this.client.rest.delete(
      `/guilds/${this.guildId}/roles/${this.id}`,
      headers
    );
  }

  /**
   * Sets the position of this role
   */
  public async setPosition(position: number, reason?: string): Promise<Role[]> {
    const headers: Record<string, string> = {};
    if (reason) headers["X-Audit-Log-Reason"] = reason;

    const roles = await this.client.rest.patch(
      `/guilds/${this.guildId}/roles`,
      [{ id: this.id, position }],
      headers
    );
    return (roles as RoleData[]).map(
      (data: RoleData) => new Role(this.client, data, this.guildId)
    );
  }

  /**
   * Gets the color as a hex string
   */
  public get hexColor(): string {
    return `#${this.color.toString(16).padStart(6, "0")}`;
  }

  /**
   * Gets the role's icon URL if it has one
   */
  public iconURL(
    options: { size?: number; format?: "png" | "jpg" | "webp" } = {}
  ): string | null {
    if (!this.icon) return null;
    const { size = 256, format = "png" } = options;
    return `https://cdn.discordapp.com/role-icons/${this.id}/${this.icon}.${format}?size=${size}`;
  }

  /**
   * Whether this role is the @everyone role
   */
  public get isEveryone(): boolean {
    return this.id === this.guildId;
  }

  /**
   * Whether this role is managed by an integration
   */
  public get isManaged(): boolean {
    return this.managed;
  }

  /**
   * Whether this role is hoisted (displayed separately)
   */
  public get isHoisted(): boolean {
    return this.hoist;
  }

  /**
   * Whether this role can be mentioned
   */
  public get isMentionable(): boolean {
    return this.mentionable;
  }

  /**
   * The mention string for this role
   */
  public toString(): string {
    return `<@&${this.id}>`;
  }

  /**
   * Gets members who have this role
   */
  public async fetchMembers(): Promise<any[]> {
    const members = await this.client.rest.get(
      `/guilds/${this.guildId}/members?limit=1000`
    );
    return (members as any[]).filter((member: any) =>
      member.roles.includes(this.id)
    );
  }
}
