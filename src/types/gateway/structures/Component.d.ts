export interface Component {
  type: number;
  custom_id?: string;
  disabled?: boolean;
  style?: number;
  label?: string;
  emoji?: {
    name: string;
    id?: string;
    animated?: boolean;
  };
  url?: string;
  options?: Array<{
    label: string;
    value: string;
    description?: string;
    emoji?: {
      name: string;
      id?: string;
      animated?: boolean;
    };
    default?: boolean;
  }>;
}
