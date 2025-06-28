import type { User as RawUser } from "../types/structures/User";

export class User {
  constructor(public data: RawUser) {}

  get name(): string {
    return this.data.username;
  }

  get discriminator(): string {
    return this.data.discriminator;
  }

  get id(): string {
    return this.data.id;
  }

  get tag(): string {
    return `${this.name}#${this.discriminator}`;
  }

  get mention(): string {
    return `<@${this.id}>`;
  }

  get isSystem(): boolean {
    return this.data.system === true;
  }

  get isVerified(): boolean {
    return this.data.verified === true;
  }

  get isMFAEnabled(): boolean {
    return this.data.mfa_enabled === true;
  }

  get isBot(): boolean {
    return this.data.bot === true;
  }

  get avatarURL(): string | null {
    return this.data.avatar
      ? `https://cdn.discordapp.com/avatars/${this.data.id}/${this.data.avatar}.png`
      : null;
  }
}
