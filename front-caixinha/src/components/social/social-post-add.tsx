import { useUserAuth } from '@/hooks/useUserAuth';
import { publicarPost, uploadResource } from '@/pages/api/api.service';
import { getInitials } from '@/utils/utils';
import { AttachEmail, BrowserUpdated, EmojiEmotions, Image } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const SocialPostAdd = (props: any) => {
    const { user } = useUserAuth()
    const smUp = useMediaQuery((theme: any) => theme.breakpoints.up('sm'));
    const [media, setMedia] = useState<string | null>(null)
    const [postText, setPostText] = useState('')
    const { t } = useTranslation()

    const uploadPhoto = useCallback(() => {
        let input = document.createElement('input');
        input.type = 'file';

        input.addEventListener('change', function (event: any) {
            let arquivo = event.target.files[0];

            toast.loading(t('realizando_upload'))
            uploadResource(arquivo)
                .then((fileUrl: string) => {
                    setMedia(fileUrl)
                    toast.success(t('upload_sucesso'))
                })
                .catch(e => toast.error(e.message))
        });

        input.click()
    }, [t])

    const post = () => {
        toast.loading(t('feed.publicando'))
        publicarPost({
            authorName: user?.name,
            authorAvatar: user?.photoUrl,
            message: postText,
            media
        })
            .then(() => {
                toast.success(t('sucesso'))
                setPostText('')
                setMedia(null)
            })
            .catch(e => toast.error(e.message))
    }

    return (
        <Card {...props}>
            <CardContent>
                <Stack
                    alignItems="flex-start"
                    direction="row"
                    spacing={2}
                >
                    <Avatar
                        src={user?.photoUrl}
                        sx={{
                            height: 40,
                            width: 40
                        }}
                    >
                        {getInitials(user?.name)}
                    </Avatar>
                    <Stack
                        spacing={3}
                        sx={{ flexGrow: 1 }}
                    >
                        <OutlinedInput
                            fullWidth
                            multiline
                            placeholder={t('feed.placeholder')}
                            rows={3}
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                        />
                        <Stack
                            alignItems="center"
                            direction="row"
                            justifyContent="space-between"
                            spacing={3}
                        >
                            {smUp && (
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={1}
                                >
                                    <IconButton onClick={uploadPhoto}>
                                        <SvgIcon>
                                            <Image/>
                                        </SvgIcon>
                                    </IconButton>
                                    <IconButton>
                                        <SvgIcon>
                                            <AttachEmail />
                                        </SvgIcon>
                                    </IconButton>
                                    <IconButton>
                                        <SvgIcon>
                                            <BrowserUpdated />
                                        </SvgIcon>
                                    </IconButton>
                                    <IconButton>
                                        <SvgIcon>
                                            <EmojiEmotions />
                                        </SvgIcon>
                                    </IconButton>
                                </Stack>
                            )}
                            <div>
                                <Button variant="contained" onClick={post}>
                                    {t('Post')}
                                </Button>
                            </div>
                        </Stack>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};
