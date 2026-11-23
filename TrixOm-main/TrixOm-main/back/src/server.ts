import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes/router';

export const createServer = (): Application => {
  const app: Application = express();

  // Middlewares de segurança e parse
  app.use(helmet());
  // Configuração do CORS com suporte a múltiplas origens e requisições com credenciais
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : ['http://localhost:3000'];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Permitir requisições sem origin (ex: Postman, cURL, requisições server-to-server)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
          // Retorna a própria origem para ser compatível com credentials: true
          return callback(null, true);
        }

        return callback(new Error(`CORS bloqueado para a origem: ${origin}`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
      optionsSuccessStatus: 200,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Healthcheck Route
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'omin-backend',
    });
  });

  // Rotas da API v1
  app.use('/api/v1', router);

  return app;
};

