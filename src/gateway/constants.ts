export enum GatewayOpcodes {
  DISPATCH = 0,
  HEARTBEAT = 1,
  IDENTIFY = 2,
  HELLO = 10,
  HEARTBEAT_ACK = 11,
}

export enum GatewayEvents {
  READY = "READY",
  RESUMED = "RESUMED",
  MESSAGE_CREATE = "MESSAGE_CREATE",
}

export enum Intents {
  GUILDS = 1 << 0,
  GUILD_MEMBERS = 1 << 1,
  GUILD_MESSAGES = 1 << 9,
  MESSAGE_CONTENT = 1 << 15,
}
