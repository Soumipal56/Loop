import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from './config/config.js';
import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/course.routes.js';
import webhookRoutes from './routes/webhook.routes.js';

const app: Application = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Stripe webhook must be parsed as raw body
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message,
    stack: config.nodeEnv === 'production' ? 'null' : err.stack,
  });
});

export default app;
