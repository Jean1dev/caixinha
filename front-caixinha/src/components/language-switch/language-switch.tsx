//@ts-nocheck
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { LanguagePopover } from './language-popover';
import { usePopover } from '@/hooks/usePopover';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

const languages = {
    en: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_the_United_States_%28DoS_ECA_Color_Standard%29.svg/640px-Flag_of_the_United_States_%28DoS_ECA_Color_Standard%29.svg.png',
    pt: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/1280px-Flag_of_Brazil.svg.png',
};

export const LanguageSwitch = () => {
    const { i18n } = useTranslation();
    const popover = usePopover();

    const flag = languages[i18n.language];

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
                anchorEl={popover.anchorRef.current}
                onClose={popover.handleClose}
                open={popover.open}
            />
        </>
    );
};
