//@ts-nocheck
import Avatar, { avatarClasses } from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const getLastMessage = (thread) => {
    return thread.messages?.[thread.messages.length - 1];
};

const getRecipients = (participants, userId) => {
    return participants.filter((participant) => participant.id !== userId);
};

const getDisplayName = (recipients) => {
    return recipients
        .map((participant) => participant.name)
        .join(', ');
};

const getDisplayContent = (userId, lastMessage) => {
    if (!lastMessage) {
        return '';
    }

    const author = lastMessage.authorId === userId ? 'Me: ' : '';
    const message = lastMessage.contentType === 'image'
        ? 'Sent a photo'
        : lastMessage.body;

    return `${author}${message}`;
};

const getLastActivity = (lastMessage) => {
    if (!lastMessage) {
        return null;
    }

    const lastActivityDate = new Date(lastMessage.createdAt);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastActivityDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} days ago`;
    }

    return lastActivityDate.toLocaleDateString();
};

interface ChatThreadItemProps {
    active: boolean
    onSelect: Function
    thread: any
}

export const ChatThreadItem = (props: ChatThreadItemProps) => {
    const { active = false, thread, onSelect, ...other } = props;
    const user = {
        id: '5e86809283e28b96d2d38537',
        avatar: '/assets/avatars/avatar-anika-visser.png',
        name: 'Anika Visser',
        email: 'anika.visser@devias.io'
      };

    const recipients = getRecipients(thread.participants || [], user.id);
    const lastMessage = getLastMessage(thread);
    const lastActivity = getLastActivity(lastMessage);
    const displayName = getDisplayName(recipients);
    const displayContent = getDisplayContent(user.id, lastMessage);
    const groupThread = recipients.length > 1;
    const isUnread = !!(thread.unreadCount && thread.unreadCount > 0);

    return (
        <Stack
            component="li"
            direction="row"
            onClick={onSelect}
            spacing={2}
            sx={{
                borderRadius: 2.5,
                cursor: 'pointer',
                px: 3,
                py: 2,
                '&:hover': {
                    backgroundColor: 'action.hover'
                },
                ...(active && {
                    backgroundColor: 'action.hover'
                })
            }}
            {...other}>
            <div>
                <AvatarGroup
                    max={2}
                    sx={{
                        [`& .${avatarClasses.root}`]: groupThread
                            ? {
                                height: 26,
                                width: 26,
                                '&:nth-of-type(2)': {
                                    mt: '10px'
                                }
                            }
                            : {
                                height: 36,
                                width: 36
                            }
                    }}
                >
                    {recipients.map((recipient) => (
                        <Avatar
                            key={recipient.id}
                            src={recipient.avatar || undefined}
                        />
                    ))}
                </AvatarGroup>
            </div>
            <Box
                sx={{
                    flexGrow: 1,
                    overflow: 'hidden'
                }}
            >
                <Typography
                    noWrap
                    variant="subtitle2"
                >
                    {displayName}
                </Typography>
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                >
                    {isUnread && (
                        <Box
                            sx={{
                                backgroundColor: 'primary.main',
                                borderRadius: '50%',
                                height: 8,
                                width: 8
                            }}
                        />
                    )}
                    <Typography
                        color="text.secondary"
                        noWrap
                        sx={{ flexGrow: 1 }}
                        variant="subtitle2"
                    >
                        {displayContent}
                    </Typography>
                </Stack>
            </Box>
            {lastActivity && (
                <Typography
                    color="text.secondary"
                    sx={{ whiteSpace: 'nowrap' }}
                    variant="caption"
                >
                    {lastActivity}
                </Typography>
            )}
        </Stack>
    );
};

