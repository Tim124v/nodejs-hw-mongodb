import 'dotenv/config';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

// Сначала подключаемся к MongoDB, затем запускаем сервер
initMongoConnection().then(() => {
  setupServer();
});
