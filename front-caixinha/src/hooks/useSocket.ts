import { COMMUNICATION_SERVICE } from "@/constants/ApiConts";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

function mockSocket() {
    return {
        onopen: () => { },
        onmessage: () => { },
        onclose: () => { },
        send: () => { },
        readyState: 0
    }
}

/**
 * 
 *     conn.send(JSON.stringify({
                    type: 'notify_all_members_caixinha',
                    payload: {
                        "user": "jeanlucafp@gmail.com",
                        "desc": "go sender",
                        "caixinhas": [
                            "646f538de5cd54cc6344ec69sss",
                            "64775a0896ba5e48cded18fa"
                        ]
                    }
                }))
 */

export default function useSocket(eventName: string, callback: (...arg0: any[]) => void) {
    const { data: user } = useSession()
    const dev = process.env.NODE_ENV === 'development'
    const [connected, setConnected] = useState<Boolean>(false)

    const socket = useMemo(() => {
        if (dev) {
            return mockSocket()
        }

        return new WebSocket(`wss://${COMMUNICATION_SERVICE}/ws?otp=${user?.user?.email}`)
    }, [user, dev])

    useEffect(() => {
        if (!socket)
            return

        socket.onopen = () => { 
            console.log('WebSocket connected') 
            setConnected(true)
        }

        socket.onmessage = (event: any) => {
            console.log('mensagem recebida', event.data)
            callback(JSON.parse(event.data))
        }
        socket.onclose = () => { 
            console.log('close connection WebSocket') 
            setConnected(false)
        }
    }, [socket, callback])

    return { socket, connected }
}