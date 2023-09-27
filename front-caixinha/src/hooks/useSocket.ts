import { COMMUNICATION_SERVICE } from "@/constants/ApiConts";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";

export default function useSocket(eventName: string, callback: (...arg0: any[]) => void) {
    const { data: user } = useSession()

    const socket = useMemo(() => {
        return new WebSocket(`wss://${COMMUNICATION_SERVICE}/ws?otp=${user?.user?.email}`)
    }, [user])

    useEffect(() => {
        if (!socket)
            return

        socket.onopen = () => console.log('conexao aberta')
        socket.onmessage = (event: any) => {
            console.log('mensagem recebida', event.data)
            callback(event.data)
        }
        socket.onclose = () => console.log('conexao fechada')
    }, [socket])

    return socket
}