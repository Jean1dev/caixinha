import Image from 'next/image';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

const languageOptions: { [key: string]: { icon: string, label: string } } = {
    en: {
        icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_the_United_States_%28DoS_ECA_Color_Standard%29.svg/640px-Flag_of_the_United_States_%28DoS_ECA_Color_Standard%29.svg.png',
        label: 'English'
    },
    pt: {
        icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/1280px-Flag_of_Brazil.svg.png',
        label: 'Brazil'
    },
};

export const LanguagePopover = (props: any) => {
    const {
        anchorEl,
        onClose,
        open = false,
        ...other
    } = props;
    const { i18n, t } = useTranslation();

    const handleChange = useCallback(async (language: string) => {
        onClose?.();
        await i18n.changeLanguage(language);
        toast.success(`Language changed to ${language}`);
    }, [onClose, i18n]);

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
                                <Image
                                    alt={option.label}
                                    src={option.icon}
                                    width={28}
                                    height={28}
                                    unoptimized
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
