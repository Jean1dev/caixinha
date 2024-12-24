import { NextApiRequest, NextApiResponse } from 'next';

interface ResponseData {
    message: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    console.log('req', req.body)
    res.status(200).json({ message: 'Hello from Next.js API!' });
}