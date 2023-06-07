import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { IUser } from "@/pages/perfil";
import { useSession } from "next-auth/react";

export function useUserAuth() {
    const [user, setUser] = useState<IUser | null>({
        name: '',
        email: ''
    })
    const { data, status } = useSession()
    const [storedUser, setStoredUser] = useLocalStorage<IUser | null>("caixinha-user1", null);

    const updateUser = (userAuth: IUser | null) => {

        //setUser(user);
        setStoredUser(userAuth);
        //window.location.reload();
    };

    useEffect(() => {
        if (status == 'unauthenticated') {
            updateUser(null)
            return
        }

        if (storedUser) {
            setUser(storedUser)
            return
        }

        if (!storedUser && data) {
            updateUser({
                name: data?.user?.name || '',
                email: data?.user?.email || ''
            })
        }

    }, [storedUser, data, status]);

    return { user, updateUser };
}
