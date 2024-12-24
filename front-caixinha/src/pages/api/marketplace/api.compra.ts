import { AtivosListagemCompra } from "@/types/types";
import { getCarteiraApiCaller } from "../api.carteira";

interface ListagemAtivosProps {
    username?: string
    email?: string
}

class CompraApi {
    getListagemAtivos(props: ListagemAtivosProps): Promise<AtivosListagemCompra[]> {
        const callable = getCarteiraApiCaller();
        return callable('marketplace/listagem-ativos', 'GET');
    }
}

export default new CompraApi();