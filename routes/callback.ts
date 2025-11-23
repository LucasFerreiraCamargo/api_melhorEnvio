import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();

router.get("/callback", async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) {
    return res.status(400).json({ error: "Code não encontrado" });
  }

  const clientId = Number(process.env.ME_CLIENT_ID);
  if (!clientId) {
    return res.status(500).json({ error: "ME_CLIENT_ID inválido ou não definido" });
  }

  try {
    const response = await axios.post(
      "https://sandbox.melhorenvio.com.br/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: process.env.ME_CLIENT_SECRET,
        redirect_uri: "https://api-melhor-envio-brown.vercel.app/callback",
        code,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "User-Agent": "MinhaApp (meuemail@suporte.com)",
        },
      }
    );

    const { access_token } = response.data;

    // Redireciona para Expo local
    const redirectUrl = `exp://192.168.8.65:8081?token=${access_token}`;
    return res.redirect(redirectUrl);

  } catch (err: any) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({ error: "Erro ao gerar token", detalhes: err.response?.data });
  }
});

export default router;
