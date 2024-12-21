//@ts-nocheck
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { LanguagePopover } from './language-popover';
import { usePopover } from '@/hooks/usePopover';
import { useTranslations } from '@/hooks/useTranlations';
import { useCallback, useState } from 'react';

const languages = {
    "en-US": 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_the_United_States_%28DoS_ECA_Color_Standard%29.svg/640px-Flag_of_the_United_States_%28DoS_ECA_Color_Standard%29.svg.png',
    "pt-BR": 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/1280px-Flag_of_Brazil.svg.png',
};

export const LanguageSwitch = () => {
    const { currentLocale, set } = useTranslations();
    const [flag, setFlag] = useState<string>(languages[currentLocale]);
    const popover = usePopover();

    const changeLanguage = useCallback((language: 'en-US' | 'pt-BR') => {
        setFlag(languages[language]);
        set(language);
    }, [])

    return (
        <>
            <Tooltip title="Language">
                <IconButton
                    onClick={popover.handleOpen}
                    ref={popover.anchorRef}
                >
                    <Box
                        sx={{
                            width: 28,
                            '& img': {
                                width: '100%'
                            }
                        }}
                    >
                        <img src={flag} />
                    </Box>
                </IconButton>
            </Tooltip>
            <LanguagePopover
                changeLanguage={changeLanguage}
                anchorEl={popover.anchorRef.current}
                onClose={popover.handleClose}
                open={popover.open}
            />
        </>
    );
};
