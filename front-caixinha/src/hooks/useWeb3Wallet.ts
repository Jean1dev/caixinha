import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

interface IWeb3Wallet {
    publicKey: string | null
}

export default function useWeb3Wallet() {
    const [web3Wallet, setweb3Wallet] = useState<IWeb3Wallet | null>(null);
    const [storedPubKey, setStoredPubKey] = useLocalStorage<IWeb3Wallet | null>("caixinha-public-key", null);

    useEffect(() => {
        if (storedPubKey && storedPubKey.publicKey !== '') {
            setweb3Wallet({
                publicKey: storedPubKey.publicKey
            });
        }
    }, [storedPubKey]);

    const saveData = (publicKey: string) => {
        setweb3Wallet({ publicKey });
        setStoredPubKey({ publicKey });
    };

    return { web3Wallet, saveData };
}