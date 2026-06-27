import { getStorePath } from '../storage/persistent-store';

export const dbConfig = {
  uri: process.env.DB_URI || '',
  provider: process.env.DB_URI ? 'external' : 'json-file',
  dataFile: getStorePath(),
};
