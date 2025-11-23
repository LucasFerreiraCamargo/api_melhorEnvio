// server.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import routesMelhorEnvioAuth from './routes/melhorEnvioAuth';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

app.use('/api', routesMelhorEnvioAuth);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});