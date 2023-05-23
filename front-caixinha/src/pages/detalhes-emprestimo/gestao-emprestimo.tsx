import { useCallback, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Unstable_Grid2 as Grid,
    Typography
} from '@mui/material';
import { LoansForApprove } from '@/types/types';
import { useCaixinhaSelect } from '@/hooks/useCaixinhaSelect';
import { aprovarEmprestimo } from '../api/api.service';
import CenteredCircularProgress from '@/components/CenteredCircularProgress';
import { toast } from 'react-toastify';

interface IGestaoInput {
    emprestimo: LoansForApprove,
    meuEmprestimo: boolean
}

export const GestaoEmprestimo = ({ data }: { data: IGestaoInput }) => {
    const { caixinha } = useCaixinhaSelect()
    const [loading, setLoading] = useState(false)
    const [blockButtons, setBlockButtons] = useState(false)

    const aprovar = useCallback(() => {
        setLoading(true)
        aprovarEmprestimo({
            name: data.emprestimo.memberName,
            caixinhaid: caixinha?.id,
            emprestimoId: data.emprestimo.uid
        }).then(() => {
            setLoading(false)
            setBlockButtons(true)
            setTimeout(() => toast('Aprovação enviada', { hideProgressBar: true, autoClose: 4000, type: 'success', position: 'bottom-right' }), 50)
        })
    }, [caixinha, data])

    if (loading) {
        return <CenteredCircularProgress />
    }

    return (
        <Card>
            <CardHeader
                subheader="A informação não pode ser editada"
                title="Gestão"
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
                            <Typography gutterBottom variant="h6" component="div">
                                {`Valor do emprestimo R$${data.emprestimo.valueRequested}`}
                            </Typography>
                            <Divider />
                            <Typography color="text.secondary" variant="body2">
                                necessario para aprovar {data.emprestimo.requiredNumberOfApprovals}
                            </Typography>
                            <Typography color="text.secondary" variant="body2">
                                foi solicitado na data {data.emprestimo.date}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                {
                    !data.meuEmprestimo && (
                        <>
                            <Button onClick={aprovar} disabled={blockButtons} variant="contained">
                                Aprovar
                            </Button>
                            <Button disabled={blockButtons} variant="contained" color='error'>
                                Reprovar
                            </Button>
                        </>
                    )
                }
                {
                    data.meuEmprestimo && (
                        <Button variant="contained" color='info' onClick={() => alert('WIP')}>
                            Remover o emprestimo
                        </Button>
                    )
                }
            </CardActions>
        </Card>
    );
};
