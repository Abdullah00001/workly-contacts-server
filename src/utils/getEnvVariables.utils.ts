import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(__dirname, '../../.env.local') });

const load = process.env;

export const getEnvVariable = (key: string): string => {
  const value = load[key];
  if (!value) {
    throw new Error(`Missing Environment Variable: ${key}`);
  }
  return value as string;
};
