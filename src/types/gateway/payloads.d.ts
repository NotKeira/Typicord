export interface GatewayPayload {
  op: number;
  d: unknown;
  s?: number;
  t?: string;
}

export interface HelloPayloadData {
  heartbeat_interval: number;
  _trace?: string[];
}

export interface IdentifyPayload {
  op: 2;
  d: {
    token: string;
    intents: number;
    properties: {
      $os: string;
      $browser: string;
      $device: string;
    };
  };
}
