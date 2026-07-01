import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/config.js';
import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/course.routes.js';
import webhookRoutes from './routes/webhook.routes.js';

const app: Application = express();

// Security & Performance Middleware
app.use(compression());

// CORS config
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));

// Stripe webhook must be parsed as raw body
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// API Base Route
app.get('/api', (req: Request, res: Response) => {
  res.send('API is running...');
});

// Frontend is deployed separately on Vercel, so we don't serve static files here.

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message,
    stack: config.nodeEnv === 'production' ? 'null' : err.stack,
  });
});

export default app;
