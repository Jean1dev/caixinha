import { getSlideAcoes } from "@/pages/api/api.carteira"
import { useTheme } from "@emotion/react"
import { useEffect, useMemo, useState } from "react"

export const InfiteSlideDisplayAcoes = () => {
    const theme: any = useTheme()
    const color = useMemo(() => {
        return theme.palette.mode === 'dark'
            ? 'black'
            : 'white';

    }, [theme])
    const [ativos, setAtivos] = useState<any[]>([])

    useEffect(() => {
        getSlideAcoes().then(response => setAtivos(response))
    }, [])

    if (!ativos.length) {
        return <></>
    }

    return (
        <div style={{ backgroundColor: color }} className="logos">
            <div className="logos-slide">
                {
                    ativos.map((ativo: any, index: any) => (
                        <div key={index}>
                            <strong> | </strong>
                            <span>{ativo.ticker}</span>
                            <span className={ativo.type === '+' ? 'price' : 'price-negative'}>{ativo.type} {ativo.variation}</span>
                            <strong> | </strong>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}