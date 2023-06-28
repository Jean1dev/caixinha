import { getMetaPronta, getTipoAtivos } from "@/pages/api/api.carteira";
import { useEffect, useState } from "react";
import { GraficoPizzaMembros } from "../analise-caixinha/grafico-pizza-membros";
import { Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { toast } from "react-hot-toast";

export default function CarteiraStep2({ changeMeta }: { changeMeta: Function }) {
    const [perfilSelecionado, setPerfilSelecionado] = useState('')
    const [ativoComPorcentagem, setAtivoComPorcetagem] = useState<any>([])
    const [perfil] = useState([
        {
            value: 'CONSERVADOR',
            name: 'Conservador'
        },
        {
            value: 'MODERADO',
            name: 'Moderado'
        },
        {
            value: 'DINAMICO',
            name: 'Dinânmico'
        },
        {
            value: 'ARROJADO',
            name: 'Arrojado'
        },
        {
            value: 'SOFISTICADO',
            name: 'Sofisticado'
        },
        {
            value: 'META_DO_JEAN',
            name: 'do Jean'
        }])

    useEffect(() => {
        getTipoAtivos().then(res => {
            setAtivoComPorcetagem(Object.values(res['TipoAtivo']).map((it: any) => ({
                //@ts-ignore
                label: it[Object.keys(it)],
                valor: 0,
                raw: Object.keys(it)[0]
            })))
        }).catch(() => toast.error('Nao foi possivel buscar os dados de ativo'))
    }, [])

    const handleChange = (event: SelectChangeEvent) => {
        setPerfilSelecionado(event.target.value as string);
        getMetaPronta(event.target.value).then(res => {
            const newAtivos = res.map((it: any) => {
                const ativo = ativoComPorcentagem.find((jit: any) => jit.raw === it.tipoAtivo)
                return {
                    label: ativo.label,
                    valor: it.percentual,
                    raw: ativo.raw
                }
            })

            setAtivoComPorcetagem(newAtivos)
            changeMeta(event.target.value)
        }).catch(() => toast.error('Nao foi possivel buscar as metas para esse ativo'))
    };

    return (
        <>
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Perfil pré-selcionado</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={perfilSelecionado}
                        label="Age"
                        onChange={handleChange}
                    >
                        {perfil.map((item, index) => (
                            <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <GraficoPizzaMembros
                chartSeries={ativoComPorcentagem.map((it: any) => it.valor)}
                labels={ativoComPorcentagem.map((it: any) => it.label)}
                sx={{ height: '100%' }}
            />
        </>
    )
}