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
import { useCallback, useEffect, useState } from "react";
import { getMinhasCaixinhas } from "@/pages/api/caixinhas-disponiveis";
import { sairDaCaixinha } from "@/pages/api/api.service";
import toast from "react-hot-toast";
import { useUserAuth } from "@/hooks/useUserAuth";

export const InformacoesCaixinhas = () => {
    const [caixinhas, setCaixinhas] = useState([])
    const { user } = useUserAuth()

    useEffect(() => {
        getMinhasCaixinhas(user.name, user.email)
            .then((c) => setCaixinhas(c))
    }, [user])

    const sair = useCallback((caixinhaID: string) => {
        const resposta = confirm('Essa operacao e irreversivel voce tem certeza que deseja continuar?')
        if (resposta) {
            sairDaCaixinha({
                caixinhaID,
                name: user.name,
                email: user.email
            }).then(() => {
                alert('voce saiu dessa caixinha')
                window.location.reload()
            }).catch((e) => toast.error(e.message))
        }
    }, [user])

    return (
        <Card>
            <Divider />
            <Scrollbar>
                <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                nome
                            </TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {caixinhas.map((item: any, index: any) => {

                            return (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Typography variant="subtitle2">
                                            {item.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button color="error" onClick={() => sair(item.id)}>
                                            Sair
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