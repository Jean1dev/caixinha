import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { IUser } from "@/pages/perfil";
import { useSession } from "next-auth/react";
import { setDefaultHeaders } from "@/pages/api/api.carteira";
import { getDadosPerfil } from "@/pages/api/perfil";

function getKeyPix(user: any): string {
    const data = user['bankAccount']['keysPix']
    if (data.length > 0)
        return data[0]

    return ''
}

function getUsernameAndMail(data: any) {
    const username = data?.user?.name || ''
    const email = data?.user?.email || ''
    return { username, email }
}

export function useUserAuth() {
    const [user, setUser] = useState<IUser>({
        name: '',
        email: ''
    })
    const { data, status } = useSession()
    const [storedUser, setStoredUser] = useLocalStorage<IUser | null>("caixinha-user-stored-v2", null);

    const updateUser = (userAuth: IUser | null) => {
        setStoredUser(userAuth);
    };

    useEffect(() => {
        if (status == 'unauthenticated') {
            updateUser(null)
            return
        }

        if (storedUser) {
            setUser(storedUser)
            setDefaultHeaders(storedUser.name, storedUser.email)
            return
        }

        const { username, email } = getUsernameAndMail(data)

        if (!storedUser && data) {
            setDefaultHeaders(username, email)
            getDadosPerfil(email, username)
                .then((responseUser) => {
                    if (responseUser['_id']) {
                        updateUser({
                            name: responseUser['name'],
                            email: responseUser['email'],
                            phone: responseUser['phoneNumber'],
                            photoUrl: responseUser['photoUrl'],
                            pix: getKeyPix(responseUser)
                        })
                    } else {
                        updateUser({
                            name: username,
                            email
                        })
                    }

                }).catch(() => {
                    updateUser({
                        name: username,
                        email
                    })
                })
        }

    }, [storedUser, data, status]);

    return { user, updateUser };
}
