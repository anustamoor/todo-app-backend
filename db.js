import { MongoClient } from 'mongodb';

let db;
let todosCollection;

export const connectToDatabase = async () => {
  const url = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME;
  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(dbName);
    todosCollection = db.collection('todos');
    console.log('Connected to database');
  } catch (err) {
    console.error('Failed to connect to the database', err);
    throw err;
  }
};

export const getTodosCollection = () => todosCollection;