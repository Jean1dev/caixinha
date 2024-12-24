import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

interface PropertyListItemProps {
    align?: 'vertical' | 'horizontal';
    children?: React.ReactNode;
    disableGutters?: boolean;
    value?: React.ReactNode;
    label: React.ReactNode;
    [key: string]: any;
}

export const PropertyListItem: React.FC<PropertyListItemProps> = (props) => {
    const { align = 'vertical', children, disableGutters, value, label, ...other } = props;

    return (
        <ListItem
            sx={{
                px: disableGutters ? 0 : 3,
                py: 1.5
            }}
            {...other}>
            <ListItemText
                disableTypography
                primary={(
                    <Typography
                        sx={{ minWidth: align === 'vertical' ? 'inherit' : 180 }}
                        variant="subtitle2"
                    >
                        {label}
                    </Typography>
                )}
                secondary={(
                    <Box
                        sx={{
                            flex: 1,
                            mt: align === 'vertical' ? 0.5 : 0
                        }}
                    >
                        {children || (
                            <Typography
                                color="text.secondary"
                                variant="body2"
                            >
                                {value}
                            </Typography>
                        )}
                    </Box>
                )}
                sx={{
                    display: 'flex',
                    flexDirection: align === 'vertical' ? 'column' : 'row',
                    my: 0
                }}
            />
        </ListItem>
    );
};