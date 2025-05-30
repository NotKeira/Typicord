import { GatewayClient } from "@/gateway/GatewayClient";
import { GatewayEvents } from "@/gateway/constants";
import { EventEmitter } from "@/events/EventEmitter";
import { Message } from "@/structures/Message";

export class Client extends EventEmitter {
  private gateway: GatewayClient;
  public token: string;
  public intents: number;

  constructor(token: string, intents: number) {
    super();
    this.token = token;
    this.intents = intents;
    this.gateway = new GatewayClient(this.token, this.intents);

    this.gateway.events.on(GatewayEvents.READY, (data) =>
      this.emit(GatewayEvents.READY, data)
    );
    this.gateway.events.on(GatewayEvents.MESSAGE_CREATE, (data) => {
      const message = new Message(data);
      this.emit(GatewayEvents.MESSAGE_CREATE, message);
    });
  }

  public connect(): void {
    this.gateway.connect();
  }

  async sendMessage(
    channelId: string,
    content: string,
    options?: { message_reference?: { message_id: string } }
  ) {
    const body: any = { content, ...options };
    const url = `https://discord.com/api/v10/channels/${channelId}/messages`;
    const res = await fetch(url, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bot ${this.token}`
        },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`Failed to send message: ${res.statusText}`);
    const data = await res.json();
    return new Message(data);
    
  }
}
