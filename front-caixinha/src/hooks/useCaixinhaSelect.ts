import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { Caixinha } from "@/types/types";

export function useCaixinhaSelect() {
    const [caixinha, setCaixinha] = useState<Caixinha | null>(null);
    const [storedCaixinha, setStoredCaixinha] = useLocalStorage<Caixinha | null>("caixinha-select", null);

    const toggleCaixinha = (caixinha: Caixinha | undefined) => {
        if (!caixinha)
            return

        setCaixinha(caixinha);
        setStoredCaixinha(caixinha);
        window.location.reload();
    };

    useEffect(() => {
        if (storedCaixinha) {
            setCaixinha(storedCaixinha)
        }
    }, [storedCaixinha]);

    return { caixinha, toggleCaixinha };
}
