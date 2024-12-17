import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useTranslations } from '@/hooks/useTranlations';

const languageOptions: { [key: string]: { icon: string, label: string } } = {
    "en-US": {
        icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_the_United_States_%28DoS_ECA_Color_Standard%29.svg/640px-Flag_of_the_United_States_%28DoS_ECA_Color_Standard%29.svg.png',
        label: 'English'
    },
    "pt-BR": {
        icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/1280px-Flag_of_Brazil.svg.png',
        label: 'Brazil'
    },
};

export const LanguagePopover = (props: any) => {
    const {
        anchorEl,
        onClose,
        open = false,
        changeLanguage,
        ...other
    } = props;
    const { t } = useTranslations();

    const handleChange = useCallback(async (language: string) => {
        changeLanguage(language);
        onClose?.();
        const message = t.alterou_idioma;
        toast.success(message);
    }, [onClose, t]);

    return (
        <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
                horizontal: 'right',
                vertical: 'bottom'
            }}
            disableScrollLock
            transformOrigin={{
                horizontal: 'right',
                vertical: 'top'
            }}
            onClose={onClose}
            open={open}
            PaperProps={{ sx: { width: 220 } }}
            {...other}>
            {Object.keys(languageOptions).map((language) => {
                const option = languageOptions[language];

                return (
                    <MenuItem
                        onClick={() => handleChange(language)}
                        key={language}
                    >
                        <ListItemIcon>
                            <Box
                                sx={{
                                    width: 28,
                                    '& img': {
                                        width: '100%'
                                    }
                                }}
                            >
                                <img
                                    alt={option.label}
                                    src={option.icon}
                                />
                            </Box>
                        </ListItemIcon>
                        <ListItemText
                            primary={(
                                <Typography variant="subtitle2">
                                    {option.label}
                                </Typography>
                            )}
                        />
                    </MenuItem>
                );
            })}
        </Popover>
    );
};

LanguagePopover.propTypes = {
    anchorEl: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool
};
