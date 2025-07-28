import { writeContacts } from '../utils/writeContacts.js';

export const removeAllContacts = async () => {
  await writeContacts([]);
  console.log('Все контакты успешно удалены!');
};

removeAllContacts();
