import mongoose from 'mongoose';
import { logger } from './logger';

export const connectDatabase = async (): Promise<typeof mongoose> => {
  const mongoUri =
    process.env.MONGODB_URI ||
    'mongodb+srv://viiiiioi500_db_user:FYuWXvr4tZVDwUeR@cluster0.jqdhjg4.mongodb.net/omin_db?appName=Cluster0';

  try {
    const conn = await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB_NAME || 'omin_db',
    });
    logger.info(`MongoDB conectado com sucesso ao host/cluster: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      logger.error('Erro na conexão com o MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Desconectado do MongoDB');
    });

    return conn;
  } catch (error) {
    logger.error('Falha ao conectar no MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info('Conexão com MongoDB encerrada com sucesso.');
};
