import { useCallback, useState } from 'react';
import { Stack } from '@mui/material';
import { LoansForApprove } from '@/types/types';
import { useCaixinhaSelect } from '@/hooks/useCaixinhaSelect';
import { aprovarEmprestimo, recusarEmprestimo, removerEmprestimo } from '../../../pages/api/api.service';
import CenteredCircularProgress from '@/components/CenteredCircularProgress';
import { toast } from 'react-hot-toast';
import { useUserAuth } from '@/hooks/useUserAuth';
import { ResumoAprovador } from './resumo-aprovador';
import { CardEmpresa } from './card-empresa';
import { CardDatasEmprestimo } from './card-datas-emprestimo';
import { CardDetalhesEmprestimo } from './card-detalhes-emprestimo';

export interface IGestaoInput {
    emprestimo: LoansForApprove;
    meuEmprestimo: boolean;
}

export function GestaoEmprestimo({ data }: { data: IGestaoInput }) {
    const { caixinha } = useCaixinhaSelect();
    const [loading, setLoading] = useState(false);
    const [blockButtons, setBlockButtons] = useState(false);
    const { user } = useUserAuth();

    const items = [{
        quantidade: 1,
        total: data.emprestimo.totalValue,
        solicitado: data.emprestimo.valueRequested,
        juros: data.emprestimo.interest,
        descricao: data.emprestimo.description
    }];

    const dataLimite = data.emprestimo.parcelas === 0
        ? data.emprestimo.billingDates[0]?.data
        : data.emprestimo.billingDates[data.emprestimo.billingDates.length - 1]?.data;

    const aprovar = useCallback(() => {
        setLoading(true);
        aprovarEmprestimo({
            memberName: user.name,
            caixinhaid: caixinha?.id,
            emprestimoId: data.emprestimo.uid
        }).then(() => {
            setLoading(false);
            setBlockButtons(true);
            toast.success('Aprovação enviada');
        }).catch(e => {
            setLoading(false);
            toast.error(e.message);
        });
    }, [caixinha, data, user]);

    const remover = useCallback(() => {
        setLoading(true);
        removerEmprestimo({
            name: user.name,
            email: user.email,
            caixinhaId: caixinha?.id,
            emprestimoUid: data.emprestimo.uid
        }).then(() => {
            setLoading(false);
            setBlockButtons(true);
            toast.success('Emprestimo removido');
        }).catch(e => {
            setLoading(false);
            toast.error(e.message);
        });
    }, [caixinha, data, user]);

    const reprovar = useCallback(() => {
        const motivo = prompt('Escreva o motivo da rejeicao');
        const confirmacao = confirm('Voce confirma essa operacao');
        if (!confirmacao) return;
        if (!caixinha?.id) {
            toast.error('Nenhuma caixinha selecionada');
            return;
        }
        setLoading(true);
        recusarEmprestimo({
            name: user.name,
            email: user.email,
            caixinhaId: caixinha.id,
            emprestimoUid: data.emprestimo.uid,
            reason: motivo ?? ''
        }).then(() => {
            setLoading(false);
            setBlockButtons(true);
            toast.success('Emprestimo rejeitado');
        }).catch(e => {
            setLoading(false);
            toast.error(e.message);
        });
    }, [caixinha, data, user]);

    if (loading) {
        return <CenteredCircularProgress />;
    }

    return (
        <Stack spacing={3}>
            {!data.meuEmprestimo && (
                <ResumoAprovador
                    emprestimo={data.emprestimo}
                    dataLimite={dataLimite}
                    blockButtons={blockButtons}
                    onAprovar={aprovar}
                    onReprovar={reprovar}
                />
            )}
            <CardEmpresa emprestimo={data.emprestimo} />
            <CardDatasEmprestimo emprestimo={data.emprestimo} dataLimite={dataLimite} />
            <CardDetalhesEmprestimo
                emprestimo={data.emprestimo}
                items={items}
                meuEmprestimo={data.meuEmprestimo}
                blockButtons={blockButtons}
                onRemover={data.meuEmprestimo ? remover : undefined}
            />
        </Stack>
    );
}
