import top100Films from './top100Films.json';
import type { TOption } from '../Select';

const fetchTop100Films = async (): Promise<Array<TOption>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(top100Films);
    }, 300);
  });
};

export { fetchTop100Films };
