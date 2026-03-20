import {
    Card,
    Divider,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
    Button
} from "@mui/material";
import { Scrollbar } from "../scrollbar";
import { useCallback } from "react";
import { sairDaCaixinha } from "@/pages/api/api.service";
import toast from "react-hot-toast";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useTranslation } from "react-i18next";
import { useMinhasCaixinhas } from "@/features/caixinha/hooks/useMinhasCaixinhas";
import { invalidateMinhasCaixinhas } from "@/features/caixinha/api/swr-keys";

export const InformacoesCaixinhas = () => {
    const { caixinhas, refresh } = useMinhasCaixinhas()
    const { user } = useUserAuth()
    const { t } = useTranslation()

    const sair = useCallback((caixinhaID: string) => {
        const resposta = confirm(t('operacao_irreversivel'))
        if (resposta) {
            sairDaCaixinha({
                caixinhaID,
                name: user.name,
                email: user.email
            }).then(() => {
                toast.success(t('saiu_caixinha'))
                invalidateMinhasCaixinhas()
                refresh()
            }).catch((e) => toast.error(e.message))
        }
    }, [user, t, refresh])

    return (
        <Card>
            <Divider />
            <Scrollbar>
                <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                {t('nome')}
                            </TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {caixinhas.map((item) => {

                            return (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Typography variant="subtitle2">
                                            {item.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button color="error" onClick={() => sair(item.id)}>
                                            {t('sair')}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Scrollbar>
        </Card>
    )
}