import { Router } from 'express';
import axios from 'axios';

const router = Router();

// ==============================================================================
// 1. ROTA DE CALLBACK (A "PONTE")
// O Melhor Envio chama ISSO aqui (HTTPS), e nós redirecionamos para o APP (Deep Link)
// ==============================================================================
router.get('/callback', (req, res) => {
    // 1. Pegamos os dados que o Melhor Envio mandou
    const { code, error, state } = req.query;

    if (error) {
        return res.status(400).send("<h1>Erro: Acesso negado pelo usuário.</h1>");
    }

    if (!code) {
        return res.status(400).send("<h1>Erro: Código não recebido.</h1>");
    }

    // 2. Decidimos para onde mandar o usuário de volta
    // Se o frontend mandou um 'state' (ex: exp://192.168.1.5:8081), usamos ele.
    // Se não, usamos um fallback (ex: myapp://callback)
    let appRedirectUrl = (state as string) || "http://192.168.8.65:8081";

    // Decodifica caso venha codificado
    appRedirectUrl = decodeURIComponent(appRedirectUrl);

    console.log(`🔀 Redirecionando navegador para o App: ${appRedirectUrl}`);

    // 3. Montamos a URL final com o código
    // Verifica se já tem '?' na URL para usar '&' ou '?'
    const separator = appRedirectUrl.includes('?') ? '&' : '?';
    const finalUrl = `${appRedirectUrl}${separator}code=${code}`;

    // 4. O comando mágico: Redireciona o browser do celular para o App
    return res.redirect(finalUrl);
});


// ==============================================================================
// 2. ROTA DE TROCA DE TOKEN (O APP CHAMA ESSA)
// ==============================================================================
router.post('/token', async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) return res.status(400).json({ error: "Code obrigatório" });

        // A URL de callback AQUI deve ser a mesma cadastrada no painel do Melhor Envio
        // (A URL HTTPS da Vercel)
        const redirectUri = process.env.MELHORENVIO_REDIRECT_URI; 

        const payload = {
            grant_type: "authorization_code",
            client_id: process.env.MELHORENVIO_CLIENT_ID,
            client_secret: process.env.MELHORENVIO_CLIENT_SECRET,
            redirect_uri: redirectUri, 
            code
        };

        console.log("🔄 Trocando code por token com redirect_uri:", redirectUri);

        const response = await axios.post(
            "https://sandbox.melhorenvio.com.br/oauth/token",
            payload
        );

        return res.json(response.data);

    } catch (error: any) {
        console.error("❌ Erro na troca de token:", error.response?.data || error.message);
        return res.status(400).json({
            error: "Falha na troca do token",
            detalhes: error.response?.data
        });
    }
});

export default router;