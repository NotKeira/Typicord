import type WebSocket from "ws";
import { identifyPayload } from "./payloads";
import type { HelloPayloadData } from "@/types/gateway/payloads";

/**
 * Handles the Discord gateway HELLO event and sends IDENTIFY.
 * @param ws The WebSocket connection
 * @param helloData The HELLO payload data
 * @param options Token and intents for identify
 */
export function handleHello(
  ws: WebSocket,
  helloData: HelloPayloadData,
  options: {
    token: string;
    intents: number;
  }
) {
  setInterval(() => {
    ws.send(JSON.stringify({ op: 1, d: null }));
  }, helloData.heartbeat_interval);

  const identify = identifyPayload(options.token, options.intents);
  ws.send(JSON.stringify(identify));
}
