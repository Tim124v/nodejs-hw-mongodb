import mongoose from 'mongoose';

export async function initMongoConnection() {
  const {
    MONGODB_URI,
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_URL,
    MONGODB_DB,
  } = process.env;

  // Prefer a single connection string if provided (recommended for Render)
  const connectionString = MONGODB_URI
    ? MONGODB_URI
    : `mongodb+srv://${encodeURIComponent(MONGODB_USER ?? '')}:${encodeURIComponent(
        MONGODB_PASSWORD ?? '',
      )}@${MONGODB_URL ?? ''}/${MONGODB_DB ?? ''}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(connectionString);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Mongo connection error:', error.message);
    process.exit(1);
  }
}