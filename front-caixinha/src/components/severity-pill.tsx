//@ts-nocheck
import { styled } from '@mui/material/styles';

export const SeverityPillRoot = styled('span')(({ theme, ownerState }) => {
    const backgroundColor = theme.palette[ownerState.color].alpha12;
    const color = theme.palette.mode === 'dark'
        ? theme.palette[ownerState.color].main
        : theme.palette[ownerState.color].dark;

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

export const SeverityPill = (props) => {
    const { color = 'primary', children, ...other } = props;

    const ownerState = { color };

    return (
        <SeverityPillRoot ownerState={ownerState} {...other}>
            {children}
        </SeverityPillRoot>
    );
};
