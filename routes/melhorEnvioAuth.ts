// src/routes/melhorenvio.routes.ts
import { Router } from 'express';
import axios from 'axios';
import { z } from 'zod';


const router = Router();


// Schema para validação do corpo da requisição
const tokenSchema = z.object({
    grant_type: z.enum(['authorization_code', 'refresh_token']),
    client_id: z.string().min(1),
    client_secret: z.string().min(1),
    redirect_uri: z.string().url().optional(),
    code: z.string().optional(),
    refresh_token: z.string().optional(),
});


router.post('/token', async (req, res) => {
    try {
        const analisado = tokenSchema.safeParse(req.body);


        if (!analisado.success) {
            return res.status(400).json({
                message: 'Erro de validação',
                issues: analisado.error,
            });
        }


        const data = analisado.data;
        const payload: any = {
            grant_type: data.grant_type,
            client_id: process.env.MELHORENVIO_CLIENT_ID,
            client_secret: process.env.MELHORENVIO_CLIENT_SECRET,
        };



        if (data.grant_type === 'authorization_code') {
            payload.redirect_uri = process.env.MELHORENVIO_REDIRECT_URI;
            payload.code = data.code;
        }


        if (data.grant_type === 'refresh_token') {
            payload.refresh_token = data.refresh_token;
        }


        const response = await axios.post(
            'https://sandbox.melhorenvio.com.br/oauth/token',
            payload,
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'MinhaAplicacao (contato@suporte.com)',
                },
            }
        );


        return res.status(200).json(response.data);
    } catch (error: any) {
        console.error(error);
        return res
            .status(error.response?.status || 500)
            .json(
                error.response?.data || {
                    message: 'Erro ao solicitar token',
                }
            );
    }
});


export default router;