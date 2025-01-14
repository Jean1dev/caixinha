import { Typography } from '@mui/material';
import { SeverityPillRoot } from '../severity-pill';

function get(tipo: string) {
    function data(text: string, color: string) {
        return {
            customColor: color,
            text
        }
    }
    switch (tipo) {
        case `ACAO_NACIONAL`:
            return data('Ações Nacionais', 'primary')
        case `ACAO_INTERNACIONAL`:
            return data('Ações Internacionais', 'secondary')
        case `REITs`:
            return data('Real Estate', 'error')
        case `FII`:
            return data('Fundos Imobiliarios', 'info')
        case `CRYPTO`:
            return data('Cryptomoedas', 'warning')
        case `RENDA_FIXA`:
            return data('Renda Fixa', 'success')
        case `Ações Nacionais`:
            return data('Ações Nacionais', 'primary')
        case `Ações Internacionais`:
            return data('Ações Internacionais', 'secondary')
        case `Real Estate`:
            return data('Real Estate', 'error')
        case `Fundos Imobiliarios`:
            return data('Fundos Imobiliarios', 'info')
        case `Cryptomoedas`:
            return data('Cryptomoedas', 'warning')
        case `Renda Fixa`:
            return data('Renda Fixa', 'success')
        default:
            return data(tipo, 'primary')
    }
}

export const DisplayTipoAtivo = (props: any) => {
    const { tipo, ...other } = props;

    const { customColor, text } = get(tipo);

    return (
        <SeverityPillRoot
            ownerState={{
                color: customColor
            }}
            {...other}>
            <Typography variant="body2">{text}</Typography>
        </SeverityPillRoot>
    );
};

