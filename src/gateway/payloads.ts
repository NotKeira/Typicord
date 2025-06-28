import type { IdentifyPayload } from "@/types/gateway/payloads";

export const identifyPayload = (
  token: string,
  intents: number
): IdentifyPayload => ({
  op: 2,
  d: {
    token,
    intents,
    properties: {
      $os: process.platform,
      $browser: "typicord",
      $device: "typicord",
    },
  },
});
