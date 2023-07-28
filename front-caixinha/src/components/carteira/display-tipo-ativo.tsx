import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const SeverityPillRoot = styled('span')(({ theme, customColor }: { theme: any, customColor: any }) => {
    const backgroundColor = theme.palette[customColor].alpha12;
    const color = theme.palette.mode === 'dark'
        ? theme.palette[customColor].main
        : theme.palette[customColor].dark;

    return {
        alignItems: 'center',
        backgroundColor,
        borderRadius: 12,
        color,
        cursor: 'default',
        display: 'inline-flex',
        flexGrow: 0,
        flexShrink: 0,
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.pxToRem(12),
        lineHeight: 2,
        fontWeight: 600,
        justifyContent: 'center',
        letterSpacing: 0.5,
        minWidth: 20,
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        textTransform: 'uppercase',
        whiteSpace: 'nowrap'
    };
});

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
            customColor={customColor}
            {...other}>
            <Typography variant="body2">{text}</Typography>
        </SeverityPillRoot>
    );
};

