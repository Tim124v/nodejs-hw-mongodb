import { PATH_DB } from '../constants/contacts.js';
import { promises as fs } from 'fs';

export async function readContacts() {
  try {
    const data = await fs.readFile(PATH_DB, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Если файл пустой или повреждён, возвращаем пустой массив
    if (error.code === 'ENOENT' || error.name === 'SyntaxError') {
      return [];
    }
    throw error;
  }
}
