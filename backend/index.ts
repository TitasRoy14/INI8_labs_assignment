import express from 'express';
import { createServer } from 'http';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '../shared/schema.js';
import { documents } from '../shared/schema.js';
import { eq, desc } from 'drizzle-orm';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const httpServer = createServer(app);
const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    file.mimetype === 'application/pdf'
      ? cb(null, true)
      : cb(new Error('Only PDF files allowed'));
  },
});

const uploadSchema = z.object({
  filename: z.string().min(1),
  filepath: z.string().min(1),
  filesize: z
    .number()
    .positive()
    .max(10 * 1024 * 1024),
});

app.get('/api/documents', async (_req, res) => {
  try {
    const docs = await db
      .select()
      .from(documents)
      .orderBy(desc(documents.createdAt));
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch documents' });
  }
});

app.post('/api/documents/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const data = uploadSchema.parse({
      filename: req.file.originalname,
      filepath: req.file.filename,
      filesize: req.file.size,
    });

    const [doc] = await db.insert(documents).values(data).returning();
    res.status(201).json(doc);
  } catch (error) {
    if (req.file) fs.unlinkSync(path.join(uploadsDir, req.file.filename));
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Upload failed',
    });
  }
});

app.get('/api/documents/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

    const [doc] = await db.select().from(documents).where(eq(documents.id, id));
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const filePath = path.join(uploadsDir, doc.filepath);
    if (!fs.existsSync(filePath))
      return res.status(404).json({ message: 'File not found' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(doc.filename)}"`
    );
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Download failed' });
  }
});

app.delete('/api/documents/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

    const [doc] = await db.select().from(documents).where(eq(documents.id, id));
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const filePath = path.join(uploadsDir, doc.filepath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await db.delete(documents).where(eq(documents.id, id));
    res.json({ success: true, message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

(async () => {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, '..', 'dist', 'public');
    app.use(express.static(distPath));
    app.use('*', (_req, res) =>
      res.sendFile(path.resolve(distPath, 'index.html'))
    );
  } else {
    const vite = await createViteServer({
      configFile: path.resolve(__dirname, '..', 'vite.config.ts'),
      server: {
        middlewareMode: true,
        hmr: { server: httpServer },
      },
      appType: 'custom',
    });

    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      try {
        const template = await fs.promises.readFile(
          path.resolve(__dirname, '..', 'frontend', 'index.html'),
          'utf-8'
        );
        const page = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(page);
      } catch (e) {
        next(e);
      }
    });
  }

  const port = parseInt(process.env.PORT || '5000');
  httpServer.listen(port, '0.0.0.0', () =>
    console.log(`Server running on http://localhost:${port}`)
  );
})();
