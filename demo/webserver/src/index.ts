import express, { Request, Response } from 'express';
import { openDb } from './database';
import path from 'path';

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const db = await openDb();
  await db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)');

  const existingUser = await db.get('SELECT username FROM users WHERE username = ?', [username]);
  if (existingUser) {
    res.status(409).json({ message: 'Username already exists' });
  } else {
    const result = await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    res.status(201).json({ id: result.lastID, username });
  }
});

app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const db = await openDb();
  const user = await db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
  if (user) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
