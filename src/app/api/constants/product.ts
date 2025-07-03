export const PRODUCT_NAME = {
  CAR: 'car',
  MAID: 'maid',
  MOTOR: 'motor',
} as const;

export type ProductTypeWeb = (typeof PRODUCT_NAME)[keyof typeof PRODUCT_NAME];
