import { Client } from 'pg';
// Não precisa fazer dotenv.config() aqui se já foi feito no server.ts

const connectDB = async () => {
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL, // Puxa do .env
    });
    
    await client.connect();
    console.log('PostgreSQL conectado com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar no banco de dados:', error);
    process.exit(1); // Para a aplicação caso o banco falhe
  }
};

export default connectDB;