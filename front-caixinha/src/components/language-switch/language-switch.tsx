import Image from 'next/image';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { LanguagePopover } from './language-popover';
import { usePopover } from '@/hooks/usePopover';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

const languages: Record<'en' | 'pt', string> = {
    en: 'https://flagcdn.com/w80/us.png',
    pt: 'https://flagcdn.com/w80/br.png',
}

function resolveLangKey(lng: string | undefined): 'en' | 'pt' {
    const base = (lng ?? 'pt').split('-')[0]
    return base === 'en' ? 'en' : 'pt'
}

export const LanguageSwitch = () => {
    const { i18n } = useTranslation();
    const popover = usePopover();

    const flag = languages[resolveLangKey(i18n.language)]

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
                        <Image src={flag} alt="" width={28} height={28} unoptimized />
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
