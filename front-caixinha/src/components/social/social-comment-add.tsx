import { useUserAuth } from '@/hooks/useUserAuth';
import { publicarComentario } from '@/pages/api/api.service';
import { getInitials } from '@/utils/utils';
import { Attachment, Face, Image, Link, PlusOne } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const SocialCommentAdd = (props: any) => {
    const smUp = useMediaQuery((theme: any) => theme.breakpoints.up('sm'));
    const { parentPostId } = props
    const { user } = useUserAuth()
    const [comment, setComment] = useState('')
    const [disableButton, setDisableButton] = useState(false)

    const reply = () => {
        setDisableButton(true)
        publicarComentario({
            message: comment,
            postId: parentPostId,
            authorName: user?.name,
            authorAvatar: user?.photoUrl
        }).then(() => {
            toast.success('Comentario publicado')
            setComment('')
        })
    }

    return (
        <div {...props}>
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
                    <TextField
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        fullWidth
                        multiline
                        placeholder="Type your reply"
                        rows={3}
                        variant="outlined"
                    />
                    <Stack
                        alignItems="center"
                        direction="row"
                        justifyContent="space-between"
                        spacing={3}
                    >
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={1}
                        >
                            {!smUp && (
                                <IconButton>
                                    <SvgIcon>
                                        <PlusOne />
                                    </SvgIcon>
                                </IconButton>
                            )}
                            {smUp && (
                                <>
                                    <IconButton>
                                        <SvgIcon>
                                            <Image />
                                        </SvgIcon>
                                    </IconButton>
                                    <IconButton>
                                        <SvgIcon>
                                            <Attachment />
                                        </SvgIcon>
                                    </IconButton>
                                    <IconButton>
                                        <SvgIcon>
                                            <Link />
                                        </SvgIcon>
                                    </IconButton>
                                    <IconButton>
                                        <SvgIcon>
                                            <Face />
                                        </SvgIcon>
                                    </IconButton>
                                </>
                            )}
                        </Stack>
                        <div>
                            <Button variant="contained" onClick={reply} disabled={disableButton}>
                                Reply
                            </Button>
                        </div>
                    </Stack>
                </Stack>
            </Stack>
        </div>
    );
};
