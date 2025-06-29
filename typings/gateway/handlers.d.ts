import type WebSocket from "ws";
import type { HelloPayloadData } from "@/types/gateway/payloads";
/**
 * Handles the Discord gateway HELLO event and sends IDENTIFY.
 * @param ws The WebSocket connection
 * @param helloData The HELLO payload data
 * @param options Token and intents for identify
 */
export declare function handleHello(ws: WebSocket, helloData: HelloPayloadData, options: {
    token: string;
    intents: number;
}): void;
//# sourceMappingURL=handlers.d.ts.map