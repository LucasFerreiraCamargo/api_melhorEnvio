import { Router } from 'express';
import axios from 'axios';

const router = Router();

// 1. Rota de Callback (O Melhor Envio te chama aqui depois do login)
router.get('/callback', (req, res) => {
    const { code, error } = req.query;

    if (error) {
        return res.status(400).json({ error: "O usuário negou a permissão ou ocorreu erro." });
    }

    if (!code) {
        return res.status(400).json({ error: "Código não encontrado na resposta." });
    }

    // Identifica para onde redirecionar o App
    // EM DESENVOLVIMENTO (EXPO GO): Use o IP ou exp://
    // EM PRODUÇÃO (BUILD): Use o scheme do app (ex: myapp://)
    
    // Você pode deixar isso dinâmico via variável de ambiente ou hardcoded para testes
    // Exemplo: 'exp://192.168.0.10:8081' ou 'myapp://callback'
    const appRedirectUrl = process.env.APP_SCHEME || "myapp://callback"; 

    console.log(`📌 Redirecionando code para o App: ${appRedirectUrl}`);

    // Redireciona o navegador do celular de volta para o App passando o code
    return res.redirect(`${appRedirectUrl}?code=${code}`);
});

// 2. Rota de Troca de Token (Seu App chama aqui)
router.post('/token', async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: "Code é obrigatório" });
        }

        console.log("📌 Trocando Code por Token...");

        const payload = {
            grant_type: "authorization_code",
            client_id: process.env.MELHORENVIO_CLIENT_ID,
            client_secret: process.env.MELHORENVIO_CLIENT_SECRET,
            // IMPORTANTE: Este redirect_uri deve ser EXATAMENTE O MESMO 
            // configurado no App do Melhor Envio e usado na URL de login (o /callback deste backend)
            redirect_uri: process.env.MELHORENVIO_REDIRECT_URI, 
            code
        };

        const response = await axios.post(
            "https://sandbox.melhorenvio.com.br/oauth/token",
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "User-Agent": "Aplicação (seuemail@dominio.com)" // Boa prática adicionar User-Agent
                }
            }
        );

        console.log("✅ Token gerado com sucesso!");
        return res.json(response.data);

    } catch (error: any) {
        console.error("❌ ERRO AO TROCAR TOKEN:", error.response?.data || error.message);
        return res.status(400).json({
            error: "Erro ao gerar token",
            detalhes: error.response?.data
        });
    }
});

export default router;