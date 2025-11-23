import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();

router.get("/callback", async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) return res.status(400).send("Code não encontrado");

  const clientId = Number(process.env.MELHORENVIO_CLIENT_ID);
  if (!clientId) return res.status(500).send("MELHORENVIO_CLIENT_ID inválido");

  try {
    const response = await axios.post(
      "https://sandbox.melhorenvio.com.br/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: process.env.MELHORENVIO_CLIENT_SECRET,
        redirect_uri: "https://api-melhor-envio-brown.vercel.app/callback", // precisa bater com sandbox
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

    // Detecta se é web ou Expo
    const userAgent = req.headers["user-agent"] || "";
    const isExpo = userAgent.includes("Expo") || userAgent.includes("expo");

    if (isExpo) {
      // Expo Go: esquema exp://
      const redirectUrl = `exp://192.168.8.65:8081?token=${access_token}`;
      return res.redirect(redirectUrl);
    } else {
      // Web: redireciona para página HTTPS pública
      const redirectUrl = `https://meu-front-publico.vercel.app/token?access_token=${access_token}`;
      return res.redirect(redirectUrl);
    }
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({ error: "Erro ao gerar token", detalhes: err.response?.data });
  }
});

export default router;
