export interface ProductShippingInterface {
  free?: boolean;
  general?: boolean;
  weight: number;
  width: number;
  length: number;
  height: number;
  measure_mass?: string;
  measure_size?: string;
}
