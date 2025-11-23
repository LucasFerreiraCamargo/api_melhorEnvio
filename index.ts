// server.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
// import routes from './routes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

// app.use('/api', routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});