import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { IUser } from "@/pages/perfil";
import { useSession } from "next-auth/react";
import { setDefaultHeaders } from "@/pages/api/api.carteira";
import { getDadosPerfil } from "@/pages/api/perfil";

export function useUserAuth() {
    const [user, setUser] = useState<IUser | null>({
        name: '',
        email: ''
    })
    const { data, status } = useSession()
    const [storedUser, setStoredUser] = useLocalStorage<IUser | null>("caixinha-user1", null);

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

        if (!storedUser && data) {
            setDefaultHeaders(data?.user?.name || '', data?.user?.email || '')
            getDadosPerfil(data?.user?.email || '', data?.user?.name || '')
                .then((r) => {
                    if (r['_id']) {
                        updateUser({
                            name: r['name'],
                            email: r['email'],
                            phone: r['phoneNumber'],
                            photoUrl: r['photoUrl']
                        })
                    } else {
                        updateUser({
                            name: data?.user?.name || '',
                            email: data?.user?.email || ''
                        })
                    }

                }).catch(() => {
                    updateUser({
                        name: data?.user?.name || '',
                        email: data?.user?.email || ''
                    })
                })
        }

    }, [storedUser, data, status]);

    return { user, updateUser };
}
