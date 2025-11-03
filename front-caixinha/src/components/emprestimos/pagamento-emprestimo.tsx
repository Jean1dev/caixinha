import { Key, useCallback, useEffect, useState } from 'react';
import {
    Avatar,
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
    TextField,
    Typography
} from '@mui/material';
import { LoansForApprove } from '@/types/types';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckIcon from '@mui/icons-material/Check';
import { useCaixinhaSelect } from '@/hooks/useCaixinhaSelect';
import { gerarLinkDePagamento, getBuckets, getChavesPix, pagarEmprestimo, uploadResource } from '../../pages/api/api.service';
import CenteredCircularProgress from '@/components/CenteredCircularProgress';
import { toast } from 'react-hot-toast';
import { useUserAuth } from '@/hooks/useUserAuth';

interface IProps {
    emprestimo: LoansForApprove,
}

export const PagamentoEmprestimo = ({ data }: { data: IProps }) => {
    const { caixinha } = useCaixinhaSelect()
    const [loading, setLoading] = useState(false)
    const { user } = useUserAuth()
    const [blockButtons, setBlockButtons] = useState(false)

    const [valor, setValor] = useState(() => {
        if (data.emprestimo.totalValue) {
            return data.emprestimo.totalValue
        }

        return (data.emprestimo.valueRequested * (data.emprestimo.interest / 100)) + data.emprestimo.fees
    })
    const [arquivos, setArquivo] = useState<any>([])
    const [pix, setPix] = useState<any>(null)

    useEffect(() => {
        if (!caixinha)
            return

        getBuckets()
        toast.loading('Carregando informacoes da chave pix')
        getChavesPix(caixinha.id).then(res => {
            if (res) {
                setPix({
                    chave: res.keysPix[0],
                    url: res.urlsQrCodePix[0]
                })
            }
        })
    }, [caixinha])

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

    function handleOverdueLoanError(e: any) {
        if (e.message.includes('Cannot make payment on overdue loan')) {
            window.location.href = "/renegociacao";
        }
    }

    const pagar = useCallback(() => {
        setLoading(true)
        pagarEmprestimo({
            name: user.name,
            email: user.email,
            caixinhaId: caixinha?.id,
            emprestimoUid: data.emprestimo.uid,
            valor: Number(valor),
            comprovante: arquivos.length > 0 ? arquivos[0] : null
        }).then(() => {
            setLoading(false)
            setBlockButtons(true)
            toast.success('Pagamento efetuado')
        }).catch(e => {
            setLoading(false)
            toast.error(e.message)
            handleOverdueLoanError(e)
        })
    }, [caixinha, data, valor, user])

    const uploadItem = (resource: any) => {
        toast.loading('enviando arquivo aguarde')

        uploadResource(resource.file).then((fileUrl: string) => {
            toast.success('Upload realizado')
            //@ts-ignore
            const novaLista = arquivos.filter(it => it.name !== resource.name)
            novaLista.push({ file: resource, name: resource.name, status: 'success' })
            setArquivo(novaLista)
        }).catch(e => toast.error(e.message))
    }

    const gerarCobrancaImediata = useCallback(() => {
        toast.loading('Gerando link de pagamento')

        gerarLinkDePagamento({
            name: user.name,
            email: user.email,
            pix: user.pix,
            valor: data.emprestimo.totalValue
        }).then(() => {
            alert('Link gerado, no momento so possivel acessar via o chat da caixinha no discord')
            setBlockButtons(true)
            toast.success('Seu pagamento sera processado de forma automatica')
        }).catch(() => {
            alert('Atencao, o servidor retornou que estao faltando informacoes essencias como CPF e chave Pix, verifique seu perfil e atualize seu cadastro')
        })
    }, [user, data])

    const getChipByItem = (item: any) => {
        if (item.status === 'success') {
            return (
                <p>
                    <Chip key={item.index} label={`Upload realizado ${item?.name}`} onDelete={() => { alert('adicionado') }} deleteIcon={<CheckIcon />} />
                </p>
            )
        }

        return (
            <p>
                <Chip key={item.index} label={item?.name} variant="outlined" onDelete={() => { uploadItem(item) }} deleteIcon={<CloudUploadIcon />} />
            </p>
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

                        {
                            pix?.chave && (
                                <Grid
                                    xs={12}
                                    md={6}
                                >


                                    <Avatar
                                        src={pix?.url}
                                        variant="square"
                                        sx={{
                                            height: 200,
                                            mb: 2,
                                            width: 200
                                        }}
                                    />
                                    <Typography
                                        color="text.secondary"
                                        variant="body2"
                                    >
                                        Chave pix {pix?.chave}
                                    </Typography>
                                </Grid>
                            )
                        }

                    </Grid>
                </Box>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button onClick={pagar} disabled={blockButtons} variant="contained">
                    Efetuar pagamento
                </Button>
                <Button onClick={gerarCobrancaImediata} disabled={blockButtons} variant="outlined">
                    Gerar link de pagamento
                </Button>
            </CardActions>
        </Card>
    );
};

