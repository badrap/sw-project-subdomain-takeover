import express, { Request, Response } from 'express';
import { openDb } from './database';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { matchDomain } from '../../../src/heuristic_analysis';

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// TODO: Ideally putting configuration for this in .env file
const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

const userLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

app.post('/register', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const db = await openDb();
    await db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)');
    await db.run(
        'CREATE TABLE IF NOT EXISTS domains (id INTEGER PRIMARY KEY, user_id INTEGER, domain TEXT, FOREIGN KEY(user_id) REFERENCES users(id))',
    );

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
        res.status(200).json({ message: 'Login successful', userId: user.id });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.get('/domains', async (req: Request, res: Response) => {
    const userId = req.query.userId;
    const db = await openDb();
    const domains = await db.all('SELECT * FROM domains WHERE user_id = ?', [userId]);
    res.status(200).json(domains);
});

app.get('/domain/:num', async (req: Request, res: Response) => {
    const userId = req.query.userId;
    const domainId = req.params.num;
    const db = await openDb();
    const domain = await db.get('SELECT * FROM domains WHERE user_id = ? AND id = ?', [userId, domainId]);
    if (domain) {
        res.status(200).json(domain);
    } else {
        res.status(404).json({ message: 'Domain not found' });
    }
});

app.post('/domain', async (req: Request, res: Response) => {
    const { userId, domain } = req.body;
    const db = await openDb();
    const result = await db.run('INSERT INTO domains (user_id, domain) VALUES (?, ?)', [userId, domain]);
    res.status(201).json({ id: result.lastID, domain });
});

app.put('/domain/:num', async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const domainId = req.params.num;
    const { domain } = req.body;
    const db = await openDb();
    const result = await db.run('UPDATE domains SET domain = ? WHERE user_id = ? AND id = ?', [
        domain,
        userId,
        domainId,
    ]);
    if ((result.changes ?? 0) > 0) {
        res.status(200).json({ message: 'Domain updated successfully' });
    } else {
        res.status(404).json({ message: 'Domain not found' });
    }
});

app.delete('/domain/:num', async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const domainId = req.params.num;
    const db = await openDb();
    const result = await db.run('DELETE FROM domains WHERE user_id = ? AND id = ?', [userId, domainId]);
    if ((result.changes ?? 0) > 0) {
        res.status(200).json({ message: 'Domain deleted successfully' });
    } else {
        res.status(404).json({ message: 'Domain not found' });
    }
});

app.post('/scan', async (req: Request, res: Response) => {
    const { userId, domain } = req.body;
    const db = await openDb();
    const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);

    const limiter = user ? userLimiter : publicLimiter;
    limiter(req, res, async () => {
        try {
            const vulnerabilityStatus = matchDomain(domain);
            res.status(200).json({ domain, vulnerabilityStatus });
        } catch (error) {
            res.status(500).json({ message: 'Error scanning domain', error });
        }
    });
});

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
