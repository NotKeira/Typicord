export interface Emoji {
  id: string | null;
  name: string | null;
  roles?: string[];
  user?: import("./User").User;
  require_colons?: boolean;
  managed?: boolean;
  animated?: boolean;
  available?: boolean;
}
