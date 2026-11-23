import dotenv from 'dotenv';
dotenv.config();

import { createServer } from './server';
import { connectDatabase, disconnectDatabase } from './database';
import { logger } from './logger';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  await connectDatabase();

  const app = createServer();

  const server = app.listen(PORT, () => {
    logger.info(`Servidor rodando na porta ${PORT} em ambiente de ${process.env.NODE_ENV || 'development'}`);
  });

  const handleShutdown = async (signal: string) => {
    logger.warn(`Recebido sinal de encerramento ${signal}. Fechando conexões...`);
    server.close(async () => {
      await disconnectDatabase();
      logger.info('Servidor encerrado.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

bootstrap().catch((error) => {
  logger.error('Erro fatal ao iniciar a aplicação:', error);
  process.exit(1);
});
