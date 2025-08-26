import 'dotenv/config';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

// Connect to MongoDB first, then start the server
initMongoConnection().then(() => {
  setupServer();
});
