import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { CAIXINHA_SERVICE } from '@/constants/ApiConts'

const FALLBACK_CODE =
  'ZE1oGnOPHdf4QtEvPpILx97EPHvdjmpw9wbE9P4bvmr6AzFuIbaQtQ=='

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || CAIXINHA_SERVICE).replace(/\/$/, '')
}

function getCode() {
  return (
    process.env.CAIXINHA_EMPRESTIMO_CODE ||
    process.env.EMPIRESTIMO_API_CODE ||
    FALLBACK_CODE
  )
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const body =
    typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {})

  try {
    const { data, status } = await axios.post(
      `${getBaseUrl()}/emprestimo?code=${encodeURIComponent(getCode())}`,
      body,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 25_000,
        validateStatus: () => true,
      }
    )

    if (status >= 200 && status < 300) {
      return res.status(200).json(data ?? {})
    }

    const msg =
      data && typeof data === 'object' && 'message' in data
        ? String((data as { message: unknown }).message)
        : 'Erro ao solicitar empréstimo'
    return res.status(status).json({ message: msg })
  } catch (e: unknown) {
    const msg = axios.isAxiosError(e)
      ? String(e.response?.data?.message ?? e.message)
      : e instanceof Error
        ? e.message
        : 'Erro ao solicitar empréstimo'
    return res.status(500).json({ message: msg })
  }
}
