import { createFakeContact } from '../utils/createFakeContact.js';
import { readContacts } from '../utils/readContacts.js';
import { writeContacts } from '../utils/writeContacts.js';

const generateContacts = async (number) => {
  const contacts = await readContacts();
  const newContacts = Array.from({ length: number }, () => createFakeContact());
  const updatedContacts = contacts.concat(newContacts);
  await writeContacts(updatedContacts);
  console.log(`${number} контактов успешно добавлены!`);
};

generateContacts(5);
