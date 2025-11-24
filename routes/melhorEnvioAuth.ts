// // src/routes/melhorenvio.routes.ts
// import { Router } from 'express';
// import axios from 'axios';
// import { z } from 'zod';

// const router = Router();

// // Schema ajustado — AGORA CORRETO
// const tokenSchema = z.object({
//     grant_type: z.enum(['authorization_code', 'refresh_token']),
//     code: z.string().optional(),
//     refresh_token: z.string().optional(),
// });

// router.post('/token', async (req, res) => {
//     try {
//         const analisado = tokenSchema.safeParse(req.body);

//         if (!analisado.success) {
//             return res.status(400).json({
//                 message: 'Erro de validação',
//                 issues: analisado.error,
//             });
//         }

//         const data = analisado.data;

//         // Payload FINAL — agora pega client_id e secret do ambiente
//         const payload: any = {
//             grant_type: data.grant_type,
//             client_id: process.env.MELHORENVIO_CLIENT_ID,
//             client_secret: process.env.MELHORENVIO_CLIENT_SECRET,
//         };

//         // Fluxo authorization_code
//         if (data.grant_type === 'authorization_code') {
//             payload.redirect_uri = process.env.MELHORENVIO_REDIRECT_URI;
//             payload.code = data.code;
//         }

//         // Fluxo refresh_token
//         if (data.grant_type === 'refresh_token') {
//             payload.refresh_token = data.refresh_token;
//         }

//         const response = await axios.post(
//             'https://sandbox.melhorenvio.com.br/oauth/token',
//             payload,
//             {
//                 headers: {
//                     Accept: 'application/json',
//                     'Content-Type': 'application/json',
//                     'User-Agent': 'MinhaAplicacao (contato@suporte.com)',
//                 },
//             }
//         );

//         return res.status(200).json(response.data);

//     } catch (error: any) {
//         console.error(error);
//         return res
//             .status(error.response?.status || 500)
//             .json(
//                 error.response?.data || {
//                     message: 'Erro ao solicitar token',
//                 }
//             );
//     }
// });

// export default router;


import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.post('/token', async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: "Code é obrigatório" });
        }

        console.log("📌 CODE ENVIADO PARA TROCA:", code);

        const payload = {
            grant_type: "authorization_code",
            client_id: process.env.MELHORENVIO_CLIENT_ID,
            client_secret: process.env.MELHORENVIO_CLIENT_SECRET,
            redirect_uri: process.env.MELHORENVIO_REDIRECT_URI, // precisa ser igual
            code
        };

        const response = await axios.post(
            "https://sandbox.melhorenvio.com.br/oauth/token",
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }
        );

        return res.json(response.data);

    } catch (error: any) {
        console.log("❌ ERRO AO SOLICITAR TOKEN:", error.response?.data);
        return res.status(400).json({
            error: "Erro ao gerar token",
            detalhes: error.response?.data
        });
    }
});

export default router;
