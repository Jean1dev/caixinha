import { getInitials } from '@/utils/utils';
import { Attachment, Face, Image, Link, PlusOne } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';

export const SocialCommentAdd = (props: any) => {
    const smUp = useMediaQuery((theme: any) => theme.breakpoints.up('sm'));
    const user = {
        id: '5e86809283e28b96d2d38537',
        avatar: '/assets/avatars/avatar-anika-visser.png',
        name: 'Anika Visser',
        email: 'anika.visser@devias.io'
    };

    return (
        <div {...props}>
            <Stack
                alignItems="flex-start"
                direction="row"
                spacing={2}
            >
                <Avatar
                    src={user.avatar}
                    sx={{
                        height: 40,
                        width: 40
                    }}
                >
                    {getInitials(user.name)}
                </Avatar>
                <Stack
                    spacing={3}
                    sx={{ flexGrow: 1 }}
                >
                    <TextField
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
                            <Button variant="contained">
                                Reply
                            </Button>
                        </div>
                    </Stack>
                </Stack>
            </Stack>
        </div>
    );
};
