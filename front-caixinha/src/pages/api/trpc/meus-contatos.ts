import { NextApiRequest, NextApiResponse } from 'next';
import { getMinhasCaixinhas } from '../caixinhas-disponiveis';
import { getDadosAnaliseCaixinha } from '../analise-caixinha';

interface Data {
    id: string
    avatar: string
    isActive: boolean
    lastActivity: string
    name: string
    email: string
}

interface ResponseData {
    contatos: Array<Data>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const { user, email } = req.headers

    if (!user && !email) {
        return res.status(401).json({ contatos: [] });
    }

    const contatos: Data[] = []

    const caixinhas = await getMinhasCaixinhas(user as string, email as string);
    for (const caixinha of caixinhas) {
        const resultAnalise = await getDadosAnaliseCaixinha(caixinha.id);
        resultAnalise.membros.forEach((membro: any) => {
            const exists = contatos.find(m => m.email === membro.email)

            if (exists) return
            if (email === membro.email) return

            contatos.push({
                id: membro._id         ,
                avatar: membro?.photoUrl,
                isActive: true,
                lastActivity: new Date().toDateString(),
                name: membro.name,
                email: membro.email
            })
        });
    }

    return res.status(200).json({ contatos });
}