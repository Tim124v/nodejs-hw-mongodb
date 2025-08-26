import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { authenticate } from './middlewares/authenticate.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export function setupServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(pino());

  // Swagger UI
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const swaggerDocument = JSON.parse(
      readFileSync(join(__dirname, '../docs/swagger.json'), 'utf8')
    );
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('Swagger UI is available at: /api-docs');
  } catch (error) {
    console.log('Swagger UI not loaded. Please run: npm run build-docs');
  }

  app.use('/auth', authRouter);
  app.use('/contacts', authenticate, contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} 