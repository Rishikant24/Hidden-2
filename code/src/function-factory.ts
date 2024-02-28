import hidden from './functions/hidden';

export const functionFactory = {
  hidden,
} as const;

export type FunctionFactoryType = keyof typeof functionFactory;
