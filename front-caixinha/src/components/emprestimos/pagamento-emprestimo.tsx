import { Key, useCallback, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    Unstable_Grid2 as Grid,
    InputAdornment,
    TextField
} from '@mui/material';
import { LoansForApprove } from '@/types/types';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckIcon from '@mui/icons-material/Check';
import { useCaixinhaSelect } from '@/hooks/useCaixinhaSelect';
import { pagarEmprestimo } from '../../pages/api/api.service';
import CenteredCircularProgress from '@/components/CenteredCircularProgress';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface IProps {
    emprestimo: LoansForApprove,
}

export const PagamentoEmprestimo = ({ data }: { data: IProps }) => {
    const { caixinha } = useCaixinhaSelect()
    const [loading, setLoading] = useState(false)
    const { data: user } = useSession()
    const [blockButtons, setBlockButtons] = useState(false)
    const [valor, setValor] = useState(data.emprestimo.valueRequested)
    const [arquivos, setArquivo] = useState<any>([])

    const addComprovante = () => {
        let input = document.createElement('input');
        input.type = 'file';

        input.addEventListener('change', function (event: any) {
            let arquivo = event.target.files[0];

            console.log('Arquivo selecionado:', arquivo);
            setArquivo([...arquivos, { file: arquivo, name: arquivo.name }])

        });

        input.click()
    }

    const pagar = useCallback(() => {
        setLoading(true)
        pagarEmprestimo({
            name: user?.user?.name,
            email: user?.user?.email,
            caixinhaId: caixinha?.id,
            emprestimoUid: data.emprestimo.uid,
            valor: Number(valor)
        }).then(() => {
            setLoading(false)
            setBlockButtons(true)
            toast.success('Pagamento efetuado')
        }).catch(e => {
            setLoading(false)
            toast.error(e.message)
        })
    }, [caixinha, data, valor, user])

    const getChipByItem = (item: any) => {
        if (item.status === 'success') {
            return (
                <Chip key={item.index} label={item?.name} onDelete={() => { alert('adicionado') }} deleteIcon={<CheckIcon />} />
            )
        }

        return (
            <Chip key={item.index} label={item?.name} variant="outlined" onDelete={() => { }} deleteIcon={<CloudUploadIcon />} />
        )
    }

    if (loading) {
        return <CenteredCircularProgress />
    }

    return (
        <Card>
            <CardHeader
                subheader="informe o valor"
                title="Fazer um pagamento"
            />
            <CardContent sx={{ pt: 0 }}>
                <Box sx={{ m: -1.5 }}>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            xs={12}
                            md={6}
                        >
                            <TextField
                                label="Valor solicitado"
                                id="outlined-start-adornment"
                                defaultValue={valor}
                                value={valor}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValor(Number(e.target.value))}
                                name='valor'
                                type='number'
                                sx={{ m: 1, width: '25ch' }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                }}
                            />

                            <Box display="flex" gap={2}>
                                {arquivos.map((item: { name: string, index: Key }) =>
                                    getChipByItem(item)
                                )}

                            </Box>
                            <Box display="flex" gap={2}>

                                <Button
                                    disabled={blockButtons}
                                    onClick={addComprovante}
                                    variant="contained"
                                    color="secondary"
                                >
                                    Adicionar Comprovante
                                </Button>
                            </Box>

                        </Grid>

                    </Grid>
                </Box>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button onClick={pagar} disabled={blockButtons} variant="contained">
                    Efetuar pagamento
                </Button>
            </CardActions>
        </Card>
    );
};
