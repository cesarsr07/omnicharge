import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // 1. Importa o dotenv
import connectDB from './db';

// 2. Executa a configuração para carregar as variáveis do arquivo .env
dotenv.config();

const app = express();

// Habilita o CORS e o recebimento de JSON
app.use(cors());
app.use(express.json());

// Conecta ao banco
connectDB();

// Exemplo de Rota (API)
app.get('/api/todos', (req, res) => {
    res.json([{ text: "Aprender Node", completed: false }]);
});

// 3. Pega a porta do arquivo .env ou usa 5000 como fallback de segurança
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));