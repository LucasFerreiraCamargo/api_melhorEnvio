// server.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import routesMelhorEnvioAuth from './routes/melhorEnvioAuth';
import callbackRoute from "./routes/callback";
import melhorEnvioRoutes from "./routes/melhorEnvio.routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

app.use('/', routesMelhorEnvioAuth);
app.use("/", callbackRoute);
app.use("/", melhorEnvioRoutes);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});