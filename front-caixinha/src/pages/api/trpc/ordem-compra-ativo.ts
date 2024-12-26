import { OrdemCompraCall } from '@/service/backendCalls';
import { NextApiRequest, NextApiResponse } from 'next';

interface ResponseData {
    message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const { user, email } = req.headers

    if (!user && !email) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const result = await OrdemCompraCall({
        quantidade: 1,
        ticker: req.body.ativo
    });

    res.status(result.status).json({ message: result.message });
}